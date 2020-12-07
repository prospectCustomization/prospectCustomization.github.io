// Should include an offset; a way to calculate with the lowest overall weight.
var swingweight;
var balance;
var massGrams;
var massKg;
var mgri;
const gravity = 980.5;

function specsForm(){

	// Had to include parseFloat; swingweight was for some reason going as string.
	swingweight = parseFloat(document.getElementById("swingweight").value);
	balance = parseFloat(document.getElementById("balance").value);
	massGrams = parseFloat(document.getElementById("mass").value);
	
	massKg = massGrams * .001;

	// 10510 / (325 + (20 * (.335) * 32) - (100 * .335)) = 20.77

	var inertia = swingweight + (20 * massKg * balance) - 100 * massKg;
	mgri = (massKg * gravity * balance) / inertia;
	var mgriBackhand = massKg * gravity * (balance - 10) / swingweight;

	//var 

	if(mgri == 0 || mgri === null || isNaN(mgri)){
		console.log("Missing info");
		document.getElementById("desiredMgri").disabled = true;
		document.getElementById("desiredMgri").type = "text";
		document.getElementById("desiredMgri").value = "Enter specs first.";
	}
	else {
		document.getElementById("mgri").value = mgri.toFixed(3);
		document.getElementById("mgriBackhand").value = mgriBackhand.toFixed(3);
		document.getElementById("desiredMgri").disabled = false;
		document.getElementById("desiredMgri").type = "number";
		calculateSpecs();
	}
}

function calculateSpecs(){
	var desiredMgri = parseFloat(document.getElementById("desiredMgri").value);

	var adjustedSwingweight = swingweight;
	var adjustedBalance = balance;
	var adjustedMassKg = massKg;
	var inertia;
	var currentMgri = mgri;

	// If MGRI is higher than desired, raise SW until corrected.

	if(currentMgri > desiredMgri && (desiredMgri > 18 && desiredMgri < 23)){
		while(currentMgri > desiredMgri && adjustedSwingweight < 600){
			adjustedSwingweight = adjustedSwingweight + 1;
			adjustedBalance = adjustedBalance + (0.1 / 3);
			adjustedMassKg = adjustedMassKg + (.001 / 3);

			var inertia = adjustedSwingweight + (20 * adjustedMassKg * adjustedBalance) - 100 * adjustedMassKg;
			currentMgri = (adjustedMassKg * gravity * adjustedBalance) / inertia;
		}
	}
	else if (currentMgri < desiredMgri && (desiredMgri > 18 && desiredMgri < 23)){
		while(currentMgri < desiredMgri && adjustedSwingweight < 600){
			// May want to adjust these values; particularly sw.
			adjustedSwingweight = adjustedSwingweight + 0.1;
			adjustedBalance = adjustedBalance - (0.1 / 3);
			adjustedMassKg = adjustedMassKg + .001;

			var inertia = adjustedSwingweight + (20 * adjustedMassKg * adjustedBalance) - 100 * adjustedMassKg;
			currentMgri = (adjustedMassKg * gravity * adjustedBalance) / inertia;
		}
	}

	else {
		document.getElementById("adjustedSwingweight").value = "";
		document.getElementById("adjustedBalance").value = "";
		document.getElementById("adjustedMass").value = "";
		return;
	}
	
	document.getElementById("adjustedSwingweight").value = Math.round(adjustedSwingweight);
	document.getElementById("adjustedBalance").value = Math.round(adjustedBalance * 10) / 10;
	document.getElementById("adjustedMass").value = Math.round(adjustedMassKg * 1000);
}