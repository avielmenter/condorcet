import * as React from 'react';
import Radium from 'radium';

type ComponentProps = {
	text: string,
	value: string,
	hovered: boolean,
	onSelect: (v: string) => void
}

const DropDownEntry: React.SFC<ComponentProps> = (props) => {
	const { text, value, onSelect, hovered } = props;

	return (
		<div
			style={{
				borderBottom: "1px solid gray",
				backgroundColor: hovered ? "#FFFFFF77" : undefined,
				width: "100%",
				':hover': {
					backgroundColor: "#FFFFFF77"
				}
			}}
			onMouseDownCapture={() => onSelect(value)}
		>
			<div style={{ padding: "3pt" }}>
				{text}
			</div>
		</div>
	)
};

export default Radium(DropDownEntry);