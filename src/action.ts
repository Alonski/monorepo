import {
	StateChannelInfos,
	AppChannelInfos,
	ChannelStates,
	OpCodeResult,
	ResponseSink,
	AppChannelInfo,
	StateChannelInfo,
	ClientMessage,
	FreeBalance
} from "./types";
import { AppChannelInfoImpl, StateChannelInfoImpl } from "./state";
import {
	CounterfactualVM,
	Instructions,
	AckInstructions,
	InternalMessage
} from "./vm";
(Symbol as any).asyncIterator =
	Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");

export class Action {
	name: string;
	requestId: string;
	clientMessage: ClientMessage;
	execution: ActionExecution;
	instructions: string[][];

	constructor(
		id: string,
		action: string,
		clientMessage: ClientMessage,
		isAckSide: boolean = false
	) {
		this.requestId = id;
		this.clientMessage = clientMessage;
		this.name = action;

		if (isAckSide) {
			this.instructions = AckInstructions[action];
		} else {
			this.instructions = Instructions[action];
		}
	}

	execute(vm: CounterfactualVM): ActionExecution {
		let exe = new ActionExecution(this, 0, this.clientMessage, vm);
		this.execution = exe;
		return exe;
	}
}

export class ActionExecution {
	action: Action;
	instructionPointer: number;
	opCodes: string[][];
	clientMessage: ClientMessage;
	vm: CounterfactualVM;
	// probably not the best data structure
	results: { opCode: string; value: any }[];
	stateChannelInfos: StateChannelInfos;
	appChannelInfos: AppChannelInfos;

	constructor(
		action: Action,
		instruction: number,
		clientMessage: ClientMessage,
		vm: CounterfactualVM
	) {
		this.action = action;
		this.instructionPointer = instruction;
		this.opCodes = action.instructions;
		this.clientMessage = clientMessage;
		this.vm = vm;
		this.results = [];
		this.stateChannelInfos = vm.stateChannelInfos;
		this.appChannelInfos = vm.appChannelInfos;
	}

	initializeExecution() {
		if (this.action.name === "setup") {
			let stateChannel = new StateChannelInfoImpl(
				this.clientMessage.toAddress,
				this.clientMessage.fromAddress,
				this.clientMessage.multisigAddress
			);
			this.clientMessage.stateChannel = stateChannel;
			// TODO Think about pending state/whether we want to do this for the
			// underlying copy
			this.vm.mutateState({
				[this.clientMessage.multisigAddress]: stateChannel
			});
		}
	}

	async next(): Promise<{ done: boolean; value: number }> {
		if (this.instructionPointer === this.opCodes.length) {
			return { done: true, value: 0 };
		}
		if (this.instructionPointer === 0) {
			this.initializeExecution();
		}
		let op = this.opCodes[this.instructionPointer];
		let internalMessage = new InternalMessage(
			this.action.name,
			op,
			this.clientMessage
		);

		let value = await this.runMiddlewares(internalMessage);
		this.instructionPointer++;
		this.results.push({ opCode: op[0], value });
		return { value, done: false };
	}

	// logger, store, syncWallets, instruction itself
	async runMiddlewares(msg: InternalMessage) {
		let resolve;
		let result = new Promise((res, rej) => {
			resolve = res;
		});

		let counter = 0;
		let middlewares = this.vm.middlewares;
		let opCode = msg.opCode;
		let context = {
			results: this.results,
			stateChannelInfos: this.stateChannelInfos,
			appChannelInfos: this.appChannelInfos,
			instructionPointer: this.instructionPointer
		};
		async function callback() {
			if (counter === middlewares.length - 1) {
				return Promise.resolve(null);
			} else {
				// This is hacky, prevents next from being called more than once
				counter++;
				let middleware = middlewares[counter];
				if (middleware.scope === "*" || middleware.scope === opCode) {
					return middleware.method(msg, callback, context);
				} else {
					return callback();
				}
			}
		}
		return middlewares[counter].method(msg, callback, context);
	}

	[Symbol.asyncIterator]() {
		return {
			next: () => this.next()
		};
	}

	executeInstruction(instr) {}
}