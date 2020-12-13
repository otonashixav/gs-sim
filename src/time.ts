namespace Time {
	/**
	 * Set to contain all active EventSequences. 
	 */
	let globalTime: number = 0;
	const eventSequenceSet: Set<EventSequence> = new Set();
	
	/**
	 * Adds an EventSequence to the set, allowing it to run. This function is called by the EventSequence constructor.
	 * 
	 * @param eventSequence EventSequence to add to the list. 
	 */
	function registerEventSequence(eventSequence: EventSequence): void {
		eventSequenceSet.add(eventSequence);
	}

	/**
	 * Removes an EventSequence from the set, preventing it from running.
	 * 
	 * @param eventSequence EventSequence to remove from the list.
	 */
	function deregisterEventSequence(eventSequence: EventSequence): void {
		eventSequenceSet.delete(eventSequence);
	}

	/**
	 * Runs the next event. 
	 */
	export function runNextEvent(): void {
		const eventSequence: EventSequence = Array.from(eventSequenceSet).sort(
			(a, b) => (a._timeToNextEvent() - b._timeToNextEvent())
		)[0];
		const elapsedTime: number = eventSequence._timeToNextEvent();
		globalTime += elapsedTime;
		eventSequenceSet.forEach(eventSequence => eventSequence._elapseTime(elapsedTime));
		eventSequence._runNextEvent();
	}

	abstract class Event {
		readonly time: number = 0;
		abstract run(): void;
	}
	
	/**
	 * A sequence of events to run. 
	 */
	export class EventSequence {
		private events: Array<Event>;
		private time: number = 0;
		private speed: number = 1;
		private pauseDuration: number = 0;
		private isPersistent: boolean;

		/**
		 * Creates a new EventSequence with some events. 
		 * 
		 * @param events A sorted array of events to run.
		 * @param isPersistent If the EventSequence should not be deleted when it is empty. 
		 */
		constructor(events: Array<Event>, isPersistent: boolean = false) {
			registerEventSequence(this);
			this.events = events;
			this.isPersistent = isPersistent;
		}

		/**
		 * Pauses time for some duration. If already paused, only changes pauseDuration if the new value is larger. 
		 * 
		 * @param pauseDuration Duration to pause for. 
		 */
		pauseTime(pauseDuration: number): void {
			if (pauseDuration > this.pauseDuration) {
				this.pauseDuration = pauseDuration;
			}
		}

		/**
		 * Sets the speed at which time should pass for this EventSequence. 
		 * 
		 * @param speed New speed value.
		 */
		setSpeed(speed: number): void {
			this.speed = speed;
		}

		/**
		 * Increments time by elapsedTime, accounting for pauseDuration. 
		 * 
		 * @param elapsedTime Time to elapse. 
		 */
		_elapseTime(elapsedTime: number): void {
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
		 * Returns the time to the next event.
		 * 
		 * @returns Time to next event. 
		 */
		_timeToNextEvent(): number {
			if (this.events.length === 0) {
				return this.isPersistent ? Infinity : -1;
			}
			return this.pauseDuration + (this.events[0].time - this.time) / this.speed;
		}

		/**
		 * Runs the next event, or if there are no events, deregisters the EventSequence.
		 */
		_runNextEvent(): void {
			const event: Event | undefined = this.events.pop();
			if (event === undefined) {
				deregisterEventSequence(this);
			} else {
				event.run();
			}
		}
	}
}
