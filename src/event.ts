/** Class which handles the occurrence of events. */
export class EventHandler {
	private static time: number = 0;

	/**
	 * Creates a new EventSequence.
	 * 
	 * @param events - Events in the sequence. Should be sorted prior to calling this function.
	 * @returns A the created EventSequence.
	 */
	static createEventSequence(events: Event[]): EventSequence {
		return new EventSequenceImpl(events) as EventSequence;
	}

	/** Runs the next event. */
	static runNextEvent(): void {
		const nextEventSequence: EventSequenceImpl = Array.from(eventSequenceSet).sort(
			(a, b) => (a.timeToNextEvent() - b.timeToNextEvent())
		)[0]; // Always sort, since we don't know if the EventSequences are progressing at the same speed as before.
		const elapsedTime: number = nextEventSequence.timeToNextEvent();
		this.time += elapsedTime;
		eventSequenceSet.forEach(eventSequence => eventSequence.elapseTime(elapsedTime));
		const nextEvent: Event = nextEventSequence.popNextEvent();
		nextEvent.run();
	}

	/** Returns the current time. */
	static getTime(): number {
		return this.time;
	}
}

/** Interface for EventSequences. */
export interface EventSequence {
	/** Starts the EventSequence, allowing its Events to begin running. */
	start(): void;
	/** Ends the EventSequence, preventing Events in it from being run. */
	end(): void;
	/** Sets the speed at which time passes for the EventSequence. */
	setSpeed(speed: number): void;
	/** Pauses the EventSequence for some time. If already paused, it remains paused for the longer duration. */
	pause(duration: number): void;
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

/** Closure-scoped set of EventSequences that EventSequenceImpl and EventHandler can access. */
const eventSequenceSet: Set<EventSequenceImpl> = new Set();

/** Internal EventSequence implementation. */
class EventSequenceImpl {
	/** Ordered events that are part of the EventSequence. */
	events: Event[];
	/** Local time of the EventSequence i.e. the time elapsed since it was created. */
	time: number = 0;
	/** Local speed of the EventSequence. */
	speed: number = 1;
	/** Duration that the EventSequence is currently paused. Not affected by speed. */
	pauseDuration: number = 0;
	constructor(events: Event[]) {
		this.events = events;
	}

	/** Starts the EventSequence by adding it to eventSequenceSet */
	start(): void {
		eventSequenceSet.add(this);
	}
	/** Ends the EventSequence by removing it from eventSequenceSet. */
	end(): void {
		eventSequenceSet.delete(this);
	}

	/** Sets the local speed of the EventSequence. */
	setSpeed(speed: number): void {
		this.speed = speed;
	}

	/** Pauses the EventSequence for some duration. If already paused, it remains paused for the longer duration. */
	pause(duration: number): void {
		if (duration > this.pauseDuration) {
			this.pauseDuration = duration;
		}
	}

	/** Elapses local time. */
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

	/** Returns the time to the next event. If no events exist, returns Infinity. */
	timeToNextEvent(): number {
		if (this.events.length === 0) {
			return Infinity;
		} else {
			return this.pauseDuration + (this.events[0].time - this.time) / this.speed;
		}
	}

	/** 
	 * Removes the next event from the internal event list, and returns it. 
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
