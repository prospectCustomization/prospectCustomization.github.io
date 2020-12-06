// Should include an offset; a way to calculate with the lowest overall weight.
var swingweight;
var balance;
var massGrams;
var mgri;

function calculateMGRI(){

	swingweight = parseFloat(document.getElementById("swingweight").value);
	balance = parseFloat(document.getElementById("balance").value);
	massGrams = parseFloat(document.getElementById("mass").value);
	// Had to include parseInt; swingweight was for some reason going as string.
	var massKg = massGrams * .001;
	const gravity = 980.5;

	// 10510 / (325 + (20 * (.335) * 32) - (100 * .335)) = 20.77

	inertia = swingweight + (20 * massKg * balance) - 100 * massKg;
	mgri = (massKg * gravity * balance) / inertia;
	var mgriBackhand = massKg * gravity * (balance - 10) / swingweight

	//var 

	if(mgri == 0 || mgri === null || isNaN(mgri)){
		console.log("Missing info");
		document.getElementById("mgriDesired").disabled = true;
		document.getElementById("mgriDesired").type = "text";
		document.getElementById("mgriDesired").value = "Enter specs first.";
	}
	else {
		document.getElementById("mgri").value = mgri.toFixed(3);
		document.getElementById("mgriBackhand").value = mgriBackhand.toFixed(3);
		document.getElementById("mgriDesired").disabled = false;
		document.getElementById("mgriDesired").type = "number";
		calculateSpecs();
	}
}

function calculateSpecs(){
	var mgriDesired = document.getElementById("mgriDesired");
	console.log(swingweight);
	while(mgriDesired > mgri){
		console.log("Nope");
	}
	//	console.log(swingweight);
	//	swingweight = swingweight + 1;
	//}
}