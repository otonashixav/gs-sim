/** Runs the next event. */
export function runNextEvent(): void {
	const nextEventSequence: _EventSequence = Array.from(eventSequenceSet).sort(
		(a, b) => (a.timeToNextEvent() - b.timeToNextEvent())
	)[0]; // Always sort, since we don't know if the EventSequences are progressing at the same speed as before.
	const elapsedTime: number = nextEventSequence.timeToNextEvent();
	time += elapsedTime;
	eventSequenceSet.forEach(eventSequence => eventSequence.elapseTime(elapsedTime));
	const nextEvent: Event = nextEventSequence.popNextEvent();
	nextEvent.run();
}

/** 
 * Returns the current time. 
 * 
 * @returns The current time.
 */
export function getTime(): number {
	return time;
}

/** Closure-scoped set of EventSequences that EventSequenceImpl and EventHandler can access. */
const eventSequenceSet: Set<_EventSequence> = new Set();
let time: number = 0;

/** Public members of EventSequence. */
export class EventSequence {
	private _eventSequence: _EventSequence;
	constructor(events: Event[]) {
		this._eventSequence = new _EventSequence(events);
	}

	/** Starts the EventSequence, allowing its Events to begin running. */
	start(): void {
		eventSequenceSet.add(this._eventSequence);
	}

	/** Stops the EventSequence, preventing Events in it from being run. */
	stop(): void {
		eventSequenceSet.delete(this._eventSequence);
	}

	/** Sets the speed at which time passes for the EventSequence. */
	setSpeed(speed: number): void {
		this._eventSequence.speed = speed;
	}

	/** Pauses the EventSequence for some time. If already paused, it remains paused for the longer duration. */
	pause(duration: number): void {
		if (duration >= this._eventSequence.pauseDuration) {
			this._eventSequence.pauseDuration = duration;
		}
	}
}

/** Internal members of EventSequence. */
class _EventSequence {
	/** Ordered events that are part of the EventSequence. */
	readonly events: Event[];
	/** Local time of the EventSequence i.e. the time elapsed since it was created. */
	time: number = 0;
	/** Local speed of the EventSequence. */
	speed: number = 1;
	/** Duration that the EventSequence is currently paused. Not affected by speed. */
	pauseDuration: number = 0;
	constructor(events: Event[]) {
		this.events = Array.from(events);
	}

	/** 
	 * Elapses local time. 
	 * 
	 * @param elapsedTime - Time to elapse.
	 */
	elapseTime(elapsedTime: number): void {
		if (this.pauseDuration > 0) {
			if (this.pauseDuration >= elapsedTime) {
				this.pauseDuration -= elapsedTime;
				return;
			} else {
				elapsedTime -= this.pauseDuration;
				this.pauseDuration = 0;
			}
		}
		this.time += elapsedTime * this.speed;
	}

	/** 
	 * Returns the time to the next event. If no events exist, returns Infinity. 
	 * 
	 * @returns Time to the next event, or Infinity if no events exist.
	 */
	timeToNextEvent(): number {
		if (this.events.length === 0) {
			return Infinity;
		} else {
			return this.pauseDuration + (this.events[0].time - this.time) / this.speed;
		}
	}

	/** 
	 * Removes the next event from the internal event list, and returns it. 
	 * 
	 * @returns The next event in the internal event list.
	 */
	popNextEvent(): Event {
		const event: Event | undefined = this.events.shift();
		if (event === undefined) {
			throw new Error("Attempted to pop from an EventSequence with no Events; check that there are events to run.");
		} else {
			return event;
		}
	}
}

/** Interface for Events. */
export interface Event {
	/** A readable identifier (non-unique) for the Event. */
	readonly name: string;
	/** A Symbol identifying the Event. */
	readonly id: symbol;
	/** Time that the Event should run relative to the moment its EventSequence begins. */
	readonly time: number;
	/** What should happen when the Event runs. */
	run(): void;
}
