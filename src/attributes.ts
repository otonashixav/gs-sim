import { EventSequence } from "./event";

interface Modifier {
	attributeName: string,
	maxStacks?: number,
	duration?: number,
	value: (stacks: number) => number
}

interface ModifierProperties {
	stacks: number,
	eventSequence?: EventSequence
}

export class Attributes {
	map: Map<string, Map<Modifier, ModifierProperties>> = new Map();

	apply(modifier: Modifier): void {
		if (!this.map.has(modifier.attributeName)) {
			this.map.set(modifier.attributeName, new Map());
		}
		const properties: ModifierProperties = {
			stacks: 1
		};
		modifier.duration?
		this.map.get(modifier.attributeName)!.set(modifier, { stacks: 1 });
	}

	get(attributeName: string): number {
		let value: number = 0;
		this.map.get(attributeName)?.forEach((properties, modifier) => (value += (modifier.value(properties.stacks))));
		return value;
	}
}
