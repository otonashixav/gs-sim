export class EventManager {
	static createEventSequence(events: Event[]): EventSequence {
		return new EventSequenceImpl(events) as EventSequence;
	}

	static run(): void {
		return;
	}
}

export interface EventSequence {
	start(): void;
	stop(): void;
	setSpeed(speed: number): void;
	pause(duration: number): void;
}

export interface Event {
	readonly time: number;
	run(): void;
}

const eventSequenceSet: Set<EventSequenceImpl> = new Set();
let time: number = 0;

class EventSequenceImpl {
	events: Event[];
	speed: number = 1;
	pauseDuration: number = 0;
	constructor(events: Event[]) {
		this.events = events;
	}

	start(): void {
		eventSequenceSet.add(this);
	}

	stop(): void {
		eventSequenceSet.delete(this);
	}

	setSpeed(speed: number): void {
		this.speed = speed;
	}

	pause(duration: number): void {
		this.pauseDuration = duration;
	}
}
