import { getTime, runNextEvent, EventSequence, Event } from "./event";
const aSeq: Event[] = [
	{ time: 1.5, run: () => cSpd = 0.2 },
	{ time: 3, run: () => bSpd = 2 }
];
const bSeq: Event[] = [
	{ time: 1, run: () => console.log("b1 " + getTime().toString()) },
	{ time: 2, run: () => console.log("b2 " + getTime().toString()) },
	{ time: 3, run: () => console.log("b3 " + getTime().toString()) },
	{ time: 4, run: () => console.log("b4 " + getTime().toString()) },
	{ time: 5, run: () => console.log("b5 " + getTime().toString()) },
	{ time: 6, run: () => console.log("b6 " + getTime().toString()) }
];
const cSeq: Event[] = [
	{ time: 1, run: () => console.log("c1 " + getTime().toString()) },
	{ time: 2, run: () => console.log("c2 " + getTime().toString()) },
	{ time: 3, run: () => console.log("c3 " + getTime().toString()) },
	{ time: 4, run: () => console.log("c4 " + getTime().toString()) },
	{ time: 5, run: () => console.log("c5 " + getTime().toString()) },
	{ time: 6, run: () => console.log("c6 " + getTime().toString()) }];
let aSpd: number = 1;
let bSpd: number = 1;
let cSpd: number = 2;
const a: EventSequence = new EventSequence(aSeq, () => aSpd);
const b: EventSequence = new EventSequence(bSeq, () => bSpd);
const c: EventSequence = new EventSequence(cSeq, () => cSpd);
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
runNextEvent();
