const fs = require('fs');

const {parse} = require("@babel/parser");

const traverse = require("@babel/traverse").default;

const t = require("@babel/types");

const generator = require("@babel/generator").default;



let jscode = fs.readFileSync("./dynamic.js", {

    encoding: "utf-8"

});

let ast = parse(jscode);
//console.log(ast)


const visitor = 

{

	"FunctionDeclaration"(path){
		let  {id} =path.node;
		let code = path.toString();


		if(code.indexOf("try")!= -1|| code.indexOf("random") !=-1 || code.indexOf("Date") !=-1)
		{


			return;
		}

		eval(code);
		console.log(code);
		let cope =path.scope;
		const binding = path.scope.parent.getBinding(id.name);
		console.log(binding)
		if(!binding || binding.constantViolations.length > 0)
		{
			return;
		}

		for(const refer_path of binding.referencePaths)
		{

			let call_express = refer_path.findParent(p=>p.isCallExpression());
			if(!call_express)
			{
				continue;
			}

			let arguments = call_express.get('arguments');
			let args = [];

			arguments.forEach(arg=>{args.push(arg.isLiteral())}) //判断参数是否为Literal 类型
			if(args.length === 0 || args.indexOf(false) !== -1)
			{

				continue;
			}
			try
			{
				let value = eval(call_express.toString());//直接计算值
				value && call_express.replaceWith(t.valueToNode(value));
			}catch(e){};
		}





	}

}



//some function code





traverse(ast,visitor);

let {code} = generator(ast);

fs.writeFile('func_result.js', code, (err)=>{});
