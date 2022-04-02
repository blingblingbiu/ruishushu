const fs = require('fs');

const {parse} = require("@babel/parser");

const traverse = require("@babel/traverse").default;

const t = require("@babel/types");

const generator = require("@babel/generator").default;



let jscode = fs.readFileSync("./dynamic.js", {

    encoding: "utf-8"

});

let ast = parse(jscode);


//还原数组
const visitor =

{

	VariableDeclarator(path){

		const {id,init} =path.node;

		if(!t.isArrayExpression(init) || init.elements.length <= 1) return;

		let elements= init.elements;


		const binding  = path.scope.getBinding(id.name);

		for(const refer_path of binding.referencePaths)

		{


			let member_path = refer_path.findParent(p=>p.isMemberExpression());
			if(member_path===null )
			{


				continue;
			}


			let property = member_path.get("property");
			if(!property.isNumericLiteral())
			{
				continue;
			}

			let index = property.node.value;
			let arr_ele = elements[index];
			member_path.replaceWith(arr_ele);
			console.log("将"+index+"转换为"+JSON.stringify(arr_ele));

		}

	}

}





traverse(ast,visitor);

let {code} = generator(ast);

fs.writeFile('result.js', code, (err)=>{});
