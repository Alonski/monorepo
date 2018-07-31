export const PaymentApp = {
	contractName: "PaymentApp",
	abi: [
		{
			constant: true,
			inputs: [
				{
					components: [
						{
							name: "alice",
							type: "address"
						},
						{
							name: "bob",
							type: "address"
						},
						{
							name: "aliceBalance",
							type: "uint256"
						},
						{
							name: "bobBalance",
							type: "uint256"
						}
					],
					name: "state",
					type: "tuple"
				},
				{
					components: [
						{
							name: "assetType",
							type: "uint8"
						},
						{
							name: "limit",
							type: "uint256"
						},
						{
							name: "token",
							type: "address"
						}
					],
					name: "terms",
					type: "tuple"
				}
			],
			name: "resolver",
			outputs: [
				{
					components: [
						{
							name: "assetType",
							type: "uint8"
						},
						{
							name: "token",
							type: "address"
						},
						{
							name: "to",
							type: "address[]"
						},
						{
							name: "amount",
							type: "uint256[]"
						},
						{
							name: "data",
							type: "bytes"
						}
					],
					name: "",
					type: "tuple"
				}
			],
			payable: false,
			stateMutability: "pure",
			type: "function"
		}
	],
	bytecode:
		"0x608060405234801561001057600080fd5b50610555806100206000396000f3006080604052600436106100405763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416635b66b8d18114610045575b600080fd5b34801561005157600080fd5b506100656100603660046102cd565b61007b565b604051610072919061047d565b60405180910390f35b6100836101ab565b60408051600280825260608281019093528291829181602001602082028038833901905050925085604001518360008151811015156100be57fe5b6020908102909101015260608601518351849060019081106100dc57fe5b60209081029091010152604080516002808252606082019092529081602001602082028038833950508751825192945091849150600090811061011b57fe5b73ffffffffffffffffffffffffffffffffffffffff909216602092830290910182015286015182518390600190811061015057fe5b73ffffffffffffffffffffffffffffffffffffffff92831660209182029092018101919091526040805160a081018252885160ff16815297810151909216908701528501919091526060840191909152608083015250919050565b6040805160a081018252600080825260208201526060918101829052818101829052608081019190915290565b60006101e482356104bf565b9392505050565b6000608082840312156101fd57600080fd5b610207608061048e565b9050600061021584846101d8565b8252506020610226848483016101d8565b602083015250604061023a848285016102b5565b604083015250606061024e848285016102b5565b60608301525092915050565b60006060828403121561026c57600080fd5b610276606061048e565b9050600061028484846102c1565b8252506020610295848483016102b5565b60208301525060406102a9848285016101d8565b60408301525092915050565b60006101e482356104d8565b60006101e482356104db565b60008060e083850312156102e057600080fd5b60006102ec85856101eb565b92505060806102fd8582860161025a565b9150509250929050565b610310816104bf565b82525050565b6000610321826104bb565b808452602084019350610333836104b5565b60005b8281101561036357610349868351610307565b610352826104b5565b602096909601959150600101610336565b5093949350505050565b6000610378826104bb565b80845260208401935061038a836104b5565b60005b82811015610363576103a086835161046b565b6103a9826104b5565b60209690960195915060010161038d565b60006103c5826104bb565b8084526103d98160208601602086016104e1565b6103e281610511565b9093016020019392505050565b805160009060a08401906104038582610474565b5060208301516104166020860182610307565b506040830151848203604086015261042e8282610316565b91505060608301518482036060860152610448828261036d565b9150506080830151848203608086015261046282826103ba565b95945050505050565b610310816104d8565b610310816104db565b602080825281016101e481846103ef565b60405181810167ffffffffffffffff811182821017156104ad57600080fd5b604052919050565b60200190565b5190565b73ffffffffffffffffffffffffffffffffffffffff1690565b90565b60ff1690565b60005b838110156104fc5781810151838201526020016104e4565b8381111561050b576000848401525b50505050565b601f01601f1916905600a265627a7a7230582037c10124d8bcbc66e73e636c524972e9feed1c2524fadcafe3ddc68726c0a2d86c6578706572696d656e74616cf50037"
};