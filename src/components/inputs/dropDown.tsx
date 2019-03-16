import * as React from 'react';
import { List } from 'immutable';

import TextInput from './textInput';
import DropDownEntry from './dropDownEntry';

// COMPONENT STATE

type State = {
	options: List<[string, string]>,
	filter: string,
	selected: string | undefined,
	focused: boolean,
	hovered: number | undefined
}

// COMPONENT ACTIONS

type ItemSelected = {
	type: "ItemSelected",
	selected: string
}

type SelectHovered = {
	type: "SelectHovered"
}

type FilterChanged = {
	type: "FilterChanged",
	filter: string,
	options: List<[string, string]>
}

type FocusChanged = {
	type: "FocusChanged",
	focused: boolean
}

type IncrementHover = {
	type: "IncrementHover"
}

type DecrementHover = {
	type: "DecrementHover"
}

type OptionsChanged = {
	type: "OptionsChanged",
	options: List<[string, string]>
}

type Action
	= ItemSelected
	| SelectHovered
	| FilterChanged
	| FocusChanged
	| IncrementHover
	| DecrementHover
	| OptionsChanged;

// COMPONENT REDUCERS

const itemSelected = (state: State, action: ItemSelected) => ({
	...state,
	selected: action.selected,
	focused: false
});

const selectHovered = (state: State, action: SelectHovered) => ({
	...state,
	selected: state.hovered !== undefined ?
		state.options.get(state.hovered, [undefined])[0] :
		undefined,
	focused: false
});

const filterChanged = (state: State, action: FilterChanged) => ({
	...state,
	options: action.options.filter(o => o[1].toLowerCase().includes(action.filter.toLowerCase())).toList(),
	filter: action.filter,
	selected: undefined,
	hovered: undefined,
	focused: true
});

const focusChanged = (state: State, action: FocusChanged) => ({
	...state,
	focused: action.focused
});

const incrementHover = (state: State, action: IncrementHover) => ({
	...state,
	hovered: (state.hovered === undefined ? -1 : state.hovered) + 1 >= state.options.count() ?
		undefined :
		(state.hovered === undefined ? -1 : state.hovered) + 1
});

const decrementHover = (state: State, action: DecrementHover) => ({
	...state,
	hovered: (state.hovered === undefined ? state.options.count() : state.hovered) - 1 < 0 ?
		undefined :
		(state.hovered === undefined ? state.options.count() : state.hovered) - 1
});

const optionsChanged = (state: State, action: OptionsChanged) => ({
	...state,
	hovered: undefined,
	options: action.options.filter(o => o[1].toLowerCase().includes(state.filter.toLowerCase())).toList()
});

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "ItemSelected":
			return itemSelected(state, action);
		case "SelectHovered":
			return selectHovered(state, action);
		case "FilterChanged":
			return filterChanged(state, action);
		case "FocusChanged":
			return focusChanged(state, action);
		case "IncrementHover":
			return incrementHover(state, action);
		case "DecrementHover":
			return decrementHover(state, action);
		case "OptionsChanged":
			return optionsChanged(state, action);
	}
}

// COMPONENT VIEW

type ComponentProps = {
	options: List<[string, string]>,
	selected?: string,
	onSelect: (text: string, value: string) => void
}

const DropDown: React.SFC<ComponentProps> = (props) => {
	const { options, selected, onSelect } = props;

	const [state, dispatch] = React.useReducer(reducer, {
		options,
		filter: "",
		selected,
		focused: false,
		hovered: undefined
	});

	React.useEffect(() => dispatch({
		type: "OptionsChanged",
		options
	}), [props.options]);

	const setFilter = (filter: string) => dispatch({
		type: "FilterChanged",
		filter,
		options
	});

	const setSelection = (selected: string) => {
		const selectedItem = state.options
			.filter(i => i[1] == selected)
			.first(undefined);

		if (!selectedItem)
			return;

		dispatch({
			type: "ItemSelected",
			selected
		});

		onSelect(selectedItem[0], selectedItem[1]);
	};

	const selectHovered = () => {
		const selectedItem = state.hovered !== undefined ?
			state.options.get(state.hovered, undefined) :
			undefined;

		if (!selectedItem)
			return;

		dispatch({ type: "SelectHovered" });

		onSelect(selectedItem[0], selectedItem[1]);
	}

	const onFocus = () => dispatch({ type: "FocusChanged", focused: true });

	const onBlur = () => dispatch({ type: "FocusChanged", focused: false });

	const incrementHover = () => dispatch({ type: "IncrementHover" });
	const decrementHover = () => dispatch({ type: "DecrementHover" });

	const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		let preventDefault = true;

		if (event.key.toLowerCase() == 'enter' || event.key.toLowerCase() == 'return') {
			if (state.hovered !== undefined)
				selectHovered();
			else
				setSelection(state.filter);

			preventDefault = false;
		}
		else if (event.key.toLowerCase() == 'tab') {
			if (state.hovered !== undefined)
				selectHovered();

			preventDefault = false;
		}
		else if (event.key.toLowerCase() == "arrowdown")
			incrementHover();
		else if (event.key.toLowerCase() == "arrowup")
			decrementHover();
		else
			preventDefault = false;

		if (preventDefault)
			event.preventDefault();
	}

	return (
		<div
			onFocus={onFocus}
			onBlur={onBlur}
			style={{ position: "relative", borderBottom: "1px solid gray" }}
		>
			<TextInput
				value={state.focused ? state.filter : (state.selected || "")}
				placeholder="[Select]"
				onChange={(event) => setFilter(event.target.value)}
				onKeyDown={keyDown}
			/>
			<div style={{
				position: "absolute",
				zIndex: 1,
				visibility: state.focused ? "visible" : "hidden",
				backgroundColor: "var(--outer-space)",
				border: "1px solid gray",
				borderTop: "none",
				width: "100%"
			}}>
				{options
					.filter(([text, _value]) => text.toLowerCase().includes(state.filter.toLowerCase()))
					.map(([text, value], i) =>
						<DropDownEntry
							key={"__ddentry_" + value}
							text={text}
							value={value}
							onSelect={setSelection}
							hovered={state.hovered === i}
						/>
					)
				}
			</div>
		</div>
	);
}

export default DropDown;