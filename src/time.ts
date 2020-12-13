class EventManager {
	/** Global time; time elapsed since Time began. */
	time: number = 0;
	/** Set to contain all active EventSequences. */
	readonly eventSequenceSet: Set<EventSequence> = new Set();

	/** Returns the current time. */
	getTime(): number {
		return this.time;
	}

	/**
	 * Adds an EventSequence to the set, allowing it to run. This function is called by the EventSequence constructor.
	 * 
	 * @param eventSequence - EventSequence to add to the list. 
	 */
	registerEventSequence(eventSequence: EventSequence): void {
		this.eventSequenceSet.add(eventSequence);
	}

	/**
	 * Removes an EventSequence from the set, preventing it from running.
	 * 
	 * @param eventSequence - EventSequence to remove from the list.
	 */
	deregisterEventSequence(eventSequence: EventSequence): void {
		this.eventSequenceSet.delete(eventSequence);
	}

	/** Runs the next event. */
	runNextEvent(): void {
		const eventSequence: EventSequence = Array.from(this.eventSequenceSet).sort(
			(a, b) => (a.timeToNextEvent() - b.timeToNextEvent())
		)[0];
		const elapsedTime: number = eventSequence.timeToNextEvent();
		this.time += elapsedTime;
		this.eventSequenceSet.forEach(eventSequence => eventSequence.elapseTime(elapsedTime));
		eventSequence.runNextEvent();
	}
}

export const eventManager: EventManager = new EventManager();

/** Internal base class for all Events. */
export abstract class Event {
	/** Time that the Event should occur, relative to when its EventSequence began. */
	readonly time: number = 0;
	/** What the Event should do. */
	abstract run(): void;
}

/** A sequence of events to run. */
export class EventSequence {
	/** Events to run. Should always be ordered. */
	events: Array<Event>;
	/** Local time; time elapsed since the EventSequence began. */
	time: number = 0;
	/** Speed at which the EventSequence experiences time. */
	speed: number = 1;
	/** Time for which the EventSequence is paused. */
	pauseDuration: number = 0;
	/** If the EventSequence persists after exhausting all its events. */
	isPersistent: boolean;

	/**
	 * Creates a new EventSequence with some events. 
	 * 
	 * @param events - A sorted array of events to run.
	 * @param isPersistent - If the EventSequence should not be deleted when it is empty. 
	 */
	constructor(events: Array<Event>, isPersistent: boolean = false) {
		this.events = events;
		this.isPersistent = isPersistent;
	}

	/** Starts the EventSequence. */
	start(): void {
		eventManager.registerEventSequence(this);
	}

	/**
	 * Add an Event to the EventSequence. It should occur after all existing events. 
	 * 
	 * @param event - Event to add.
	 */
	addEvent(event: Event): void {
		this.events.push(event);
	}

	/**
	 * Pauses time for some duration. If already paused, only changes pauseDuration if the new value is larger. 
	 * 
	 * @param pauseDuration - Duration to pause for. 
	 */
	pauseTime(pauseDuration: number): void {
		if (pauseDuration > this.pauseDuration) {
			this.pauseDuration = pauseDuration;
		}
	}

	/**
	 * Sets the speed at which time should pass for this EventSequence. 
	 * 
	 * @param speed - New speed value.
	 */
	setSpeed(speed: number): void {
		this.speed = speed;
	}

	/**
	 * Increments time by elapsedTime, accounting for pauseDuration. 
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

	/** Returns the time to the next event. */
	timeToNextEvent(): number {
		if (this.events.length === 0) {
			return this.isPersistent ? Infinity : -1;
		}
		return this.pauseDuration + (this.events[0].time - this.time) / this.speed;
	}

	/** Runs the next event, or if there are no events, deregisters the EventSequence. */
	runNextEvent(): void {
		const event: Event | undefined = this.events.pop();
		if (event === undefined) {
			eventManager.deregisterEventSequence(this);
		} else {
			event.run();
		}
	}
}
