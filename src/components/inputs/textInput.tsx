import * as React from 'react';

type ComponentProps = {
	placeholder?: string,
	value?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void,
	autoFocus?: boolean
}

const TextInput: React.SFC<ComponentProps> = (props) => {
	const [isActive, setIsActive] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	return (
		<input
			{...props}
			ref={inputRef}
			onFocus={() => setIsActive(true)}
			onBlur={() => setIsActive(false)}
			maxLength={64}
			style={{
				fontSize: "inherit",
				color: (inputRef.current && inputRef.current.value != "") ? "var(--gainsboro)" : "#FFFFFF77",
				background: isActive ? "#FFFFFF11" : "none",
				border: "none",
				width: "100%",
				padding: "3pt",
				paddingRight: 0
			}}
		/>
	);
}

export default TextInput;