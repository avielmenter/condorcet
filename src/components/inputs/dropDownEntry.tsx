import * as React from 'react';

import '../util/useHover';
import useHover from '../util/useHover';

type ComponentProps = {
	text: string,
	value: string,
	hovered: boolean,
	onSelect: (v: string) => void
}

const DropDownEntry: React.FunctionComponent<ComponentProps> = (props) => {
	const { text, value, onSelect, hovered } = props;

	const [hoverRef, isHovered] = useHover<HTMLDivElement>();

	return (
		<div
			ref={hoverRef}
			style={{
				borderBottom: "1px solid gray",
				backgroundColor: hovered || isHovered ? "#FFFFFF77" : undefined,
				width: "100%"
			}}
			onMouseDownCapture={() => onSelect(value)}
		>
			<div style={{ padding: "3pt" }}>
				{text}
			</div>
		</div>
	)
};

export default DropDownEntry;