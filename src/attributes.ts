export interface Modifier {
	getValue(attributes: Attributes): number;
}

export class Attributes {
	private attributeMap: Map<string, Modifier[]> = new Map();

	getValue(attributeName: string): number {
		const modifierList: Modifier[] | undefined = this.attributeMap.get(attributeName);
		if (modifierList === undefined) {
			return 0;
		} else {
			return modifierList.reduce((sum, modifier) => sum + modifier.getValue(this), 0);
		}
	}

	applyModifier(attributeName: string, modifier: Modifier): void {
		const modifierList: Modifier[] | undefined = this.attributeMap.get(attributeName);
		if (modifierList === undefined) {
			this.attributeMap.set(attributeName, [modifier]);
		} else {
			modifierList.push(modifier);
		}
	}
}
