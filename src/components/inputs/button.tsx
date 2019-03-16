import * as React from 'react';
import Radium from 'radium';

import MaterialIcon from '../util/materialIcon';

type ComponentProps = {
	text?: string,
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
	icon?: string,
	iconColor?: string,
	iconAlign?: "right" | "left"
	style: "filled" | "underline"
}

const Button: React.FunctionComponent<ComponentProps> = (props) => {
	const buttonStyle = {
		paddingTop: "5pt",
		paddingBottom: "5pt",
		paddingRight: "1ch",
		paddingLeft: "1ch",
		borderRadius: "8pt",
		border: "none",
		fontSize: "inherit",
		color: "inherit",
	};

	const filledStyle = {
		background: "#FFFFFF11",
		':hover': {
			background: '#FFFFFF33'
		}
	};

	const underlineStyle = {
		background: "none",
		':hover': {
			textDecoration: 'underline'
		}
	};

	const style = props.style == "filled" ?
		{ ...buttonStyle, ...filledStyle } :
		{ ...buttonStyle, ...underlineStyle };

	return (
		<button
			onClick={props.onClick}
			style={style}>
			{props.icon && props.iconAlign != "right" &&
				<MaterialIcon icon={props.icon} iconColor={props.iconColor} />
			}
			{props.text && props.text != "" && <span style={{ paddingRight: "0.5ch", paddingLeft: "0.5ch" }}>
				{props.text}
			</span>}
			{props.icon && props.iconAlign == "right" &&
				<MaterialIcon icon={props.icon} iconColor={props.iconColor} />
			}
		</button>
	);
}

export default Radium(Button);