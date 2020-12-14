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
	/** Hide private members from outside the module. */
	private _eventSequence: _EventSequence;

	/**
	 * Creates a new EventSequence.
	 *
	 * @param events - Events to run. A sorted copy is made internally.
	 * @param speedFunction - A function that returns the speed that the EventSequence should run at. Default always returns 1.
	 */
	constructor(events: Event[], speedFunction: () => number = (() => 1)) {
		this._eventSequence = new _EventSequence(events, speedFunction);
		eventSequenceSet.add(this._eventSequence);
	}

	/** Deletes the EventSequence. */
	delete(): void {
		eventSequenceSet.delete(this._eventSequence);
	}
}

/** Internal members of EventSequence. */
class _EventSequence {
	/** Ordered events that are part of the EventSequence. */
	readonly events: Event[];
	/** Local time of the EventSequence i.e. the time elapsed since it was created. */
	time: number = 0;
	/** Function that returns the speed at which the EventSequence should run. */
	readonly speedFunction: () => number;

	constructor(events: Event[], speedFunction: () => number) {
		this.events = Array.from(events).sort((a, b) => a.time - b.time);
		this.speedFunction = speedFunction;
	}

	/**
	 * Elapses local time.
	 *
	 * @param elapsedTime - Time to elapse.
	 */
	elapseTime(elapsedTime: number): void {
		this.time += elapsedTime * this.speedFunction();
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
			return (this.events[0].time - this.time) / this.speedFunction();
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
	/** Time that the Event should run relative to the moment its EventSequence begins. */
	readonly time: number;
	/** What should happen when the Event runs. */
	run(): void;
}
