import * as React from 'react';

type StateProps = {

}

type AttrProps = {
	icon?: string,
	iconColor?: string
}

type ComponentProps = StateProps & AttrProps;

const MaterialIcon: React.SFC<ComponentProps> = (props) => {
	const { icon, iconColor } = props;

	const style: React.CSSProperties = {
		color: iconColor,
		fontSize: "1.25em",
		verticalAlign: "bottom"
	}

	return (
		<i className='material-icons' style={style}>
			{icon != undefined && icon.trim() != '' ? icon : ''}
		</i>
	);
}

export default MaterialIcon;