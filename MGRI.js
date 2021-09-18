// Should include an offset; a way to calculate with the lowest overall weight.
var swingweight;
var balance;
var massGrams;
var massKg;
var mgri;
var recoilWeight;
var chokeValue;
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
		document.getElementById("mgri").value = "";
		document.getElementById("mgriBackhand").value = "";
		document.getElementById("desiredMgri").disabled = true;
		document.getElementById("desiredMgri").type = "text";
		document.getElementById("desiredMgri").value = "Enter specs first.";
		document.getElementById("adjustedSwingweight").value = "";
		document.getElementById("adjustedBalance").value = "";
		document.getElementById("adjustedMass").value = "";
		document.getElementById("chokeValue").disabled = true;
		document.getElementById("chokeValue").type = "text";
		document.getElementById("chokeValue").value = "Enter specs first.";
		document.getElementById("chokeType").disabled = true;
		document.getElementById("chokeType").value = "chokeType";
		document.getElementById("frameLength").disabled = true;
		document.getElementById("pickupWeight").value = "";

	}
	else {
		document.getElementById("mgri").value = mgri.toFixed(3);
		document.getElementById("mgriBackhand").value = mgriBackhand.toFixed(3);
		document.getElementById("desiredMgri").disabled = false;
		document.getElementById("desiredMgri").type = "number";
		document.getElementById("chokeValue").disabled = false;
		document.getElementById("chokeValue").type = "number";
		document.getElementById("chokeType").disabled = false;
		document.getElementById("chokeValue").value = 0;
		document.getElementById("frameLength").value = 27;
		document.getElementById("frameLength").disabled = false;
		otherValues();
		desiredMGRI();
		effectiveMGRI();
	}
}

function otherValues(){
	// Calculate pickupweight.
	var pickupWeight = calculatePickupWeight(balance);

	document.getElementById("pickupWeight").value = pickupWeight.toFixed(2);

	recoilWeight = swingweight - massKg * Math.pow((balance - 10), 2);
	document.getElementById("recoilWeight").value = recoilWeight.toFixed(2);

}

function calculatePickupWeight(localBalance){
	var localPickupWeight = massKg * Math.pow(localBalance, 2);
	return localPickupWeight;
}

function desiredMGRI(){
	var desiredMgri = parseFloat(document.getElementById("desiredMgri").value);

	var adjustedSwingweight = swingweight;
	var adjustedBalance = balance;
	var adjustedMassKg = massKg;
	var inertia;
	var currentMgri = mgri;

	// If MGRI is higher than desired, raise SW until corrected.

	if(currentMgri > desiredMgri && (desiredMgri > 18 && desiredMgri < 23)){
		while(currentMgri > desiredMgri && adjustedSwingweight < 600){
			// 20.4 20.4
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

function effectiveMGRI(){
	// Instead of MGR/I
	// Equation is Mg(R - d)I'
	// I' = moment of inertia about axis of interest
	// Ic = moment of inertia about center of mass (Recoilweight)
	// I' = Ic + M(R-d)^2
	// Ic = sw - M(R-10)^2
	// IC = moment of inertia around balance point.
	// chokeUp negative for choke down, positive for choke up.
	var mgriAboutAxis;

	chokeValue = document.getElementById("chokeValue").value;

	if(document.getElementById("chokeType").value == "chokeUp" && chokeValue < 0){
		chokeValue = chokeValue * -1;
		document.getElementById("chokeValue").value = chokeValue;
	}

	if(document.getElementById("chokeType").value == "chokeDown" && chokeValue > 0){
		chokeValue = chokeValue * -1;
		document.getElementById("chokeValue").value = chokeValue;
	}
	if(chokeValue < 0){
		document.getElementById("chokeType").value = "chokeDown";
	}

	if(chokeValue > 0){
		document.getElementById("chokeType").value = "chokeUp";
	}

	if(chokeValue == 0){
		document.getElementById("chokeType").value = "neutral";
	}

	/*if(document.getElementById("chokeType").value == "neutral" && chokeValue != 0){
		chokeValue = 0;
		document.getElementById("chokeValue").value = chokeValue;
	}*/

	// Calculations for effective MGRI.
	// Further away because effectiveBalance / effective recoil?

	// Fix input box for this stuff eventually.
	var tempChokeValue;
	
	// Fix for null input.
	if(chokeValue){
		tempChokeValue = chokeValue;
	}
	else {
		tempChokeValue = 0;
	}

	var effectiveBalance = balance - tempChokeValue;

	console.log(effectiveBalance);
	var iPrime = recoilWeight + massKg * Math.pow((effectiveBalance), 2);

	mgriAboutAxis = (massKg * gravity * (effectiveBalance)) / iPrime;

	document.getElementById("startingMGRI").value = mgri.toFixed(3);
	document.getElementById("effectiveMGRI").value = mgriAboutAxis.toFixed(3);
	document.getElementById("chokeValue").value = chokeValue;

	effectiveValues(effectiveBalance);
}

function effectiveValues(effectiveBalance){

	var frameLength;

	frameLength = document.getElementById("frameLength").value;

	// Calculation for effective length.
	var effectiveLength = frameLength - (chokeValue * 0.39370);

	document.getElementById("effectiveLength").value = effectiveLength;

	// Calculation for effective balance.
	document.getElementById("effectiveBalance").value = effectiveBalance.toFixed(1); 

	// Effective pickupweight.
	var pickupWeight = calculatePickupWeight(effectiveBalance);
	document.getElementById("effectivePickupWeight").value = pickupWeight.toFixed(2);	

	// Calculation for reverse swingweight.
	var reverseSwingweight = swingweight - massKg * Math.pow((balance - 10),2) + 
		massKg * Math.pow((frameLength * 2.54 - balance - 10),2);
	document.getElementById("reverseSwingweight").value = reverseSwingweight.toFixed(2);

	// Calculation for handle MGRI.
	var reverseSwingweightTip = swingweight - massKg * Math.pow((balance - 10),2) + 
		massKg * Math.pow((frameLength * 2.54 - balance),2);
	var handleMGRI = (massKg * gravity * balance) / reverseSwingweightTip;
	document.getElementById("handleMGRI").value = handleMGRI.toFixed(2);

	var backhandHandleMGRI = (massKg * gravity * (balance - 10)) / reverseSwingweight;
	document.getElementById("backhandHandleMGRI").value = backhandHandleMGRI.toFixed(2);

	// Calculation for reverse effective swingweight.
	var reverseEffectiveSwingweight = swingweight - massKg * Math.pow((balance - 10),2) + 
		massKg * Math.pow((frameLength * 2.54 - balance - 10 - chokeValue),2);

	document.getElementById("reverseEffectiveSwingweight").value = 
	reverseEffectiveSwingweight.toFixed(2);


	// Calculation for effective swingweight.
	var effectiveSwingweight = recoilWeight + massKg * Math.pow((effectiveBalance - 10),2);
	document.getElementById("effectiveSwingweight").value = Math.trunc(effectiveSwingweight);

	// Calculation for effective mass.
	//distance from balance point to point of impact (cm)
	// Calculate point of impact 2/3 up
	const standardFrameLengthCm = 68.58;
	var frameLengthCm = frameLength * 2.54;
	var pointOfImpactCm = 53.34 + frameLengthCm - standardFrameLengthCm;
	var effectiveMass = massKg / (1 + massKg * Math.pow(pointOfImpactCm - balance,2) / recoilWeight)
	document.getElementById("effectiveMass").value = Math.round(effectiveMass * 1000);
}