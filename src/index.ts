import { runNextEvent, EventSequence, Event } from "./event";
const s1: Event[] = [];
const s2: Event[] = [];
const s3: Event[] = [];
for (let i: number = 0; i < 15; i += 3) {
	s1.push({
		name: i.toString(),
		id: Symbol(i.toString()),
		time: i,
		run: () => (console.log(i))
	});
	s2.push({
		name: (i + 1).toString(),
		id: Symbol((i + 1).toString()),
		time: (i + 1),
		run: () => (console.log(i + 1))
	});
	s3.push({
		name: (i + 2).toString(),
		id: Symbol((i + 2).toString()),
		time: (i + 2),
		run: () => (console.log(i + 2))
	});
}

console.log(s1, s2, s3);
const a: EventSequence = new EventSequence(s1);
const b: EventSequence = new EventSequence(s2);
const c: EventSequence = new EventSequence(s3);
a.start();
b.start();
c.start();
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
runNextEvent();
