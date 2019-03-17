import * as React from 'react';
import { List } from 'immutable';

import * as Hoox from 'toomanyhoox';

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

const DropDown: React.FunctionComponent<ComponentProps> = (props) => {
	const { options, selected, onSelect } = props;

	const onSelectMiddleware: Hoox.Middleware<State, Action> =
		(state: State) => (dispatch: React.Dispatch<Action>) => (action: Action) => {
			if (action.type == "ItemSelected") {
				const selectedItem = state.options
					.filter(i => i[1] == action.selected)
					.first(undefined);

				if (!selectedItem)
					return Hoox.NoOp;

				dispatch(action);
				onSelect(selectedItem[0], selectedItem[1]);
			}
			else if (action.type == "SelectHovered") {
				const selectedItem = state.hovered !== undefined ?
					state.options.get(state.hovered, undefined) :
					undefined;

				if (!selectedItem)
					return Hoox.NoOp;

				dispatch(action);
				onSelect(selectedItem[0], selectedItem[1]);
			}

			dispatch(action);
			return undefined;
		};

	const mapDispatchToProps = (dispatch: React.Dispatch<Action>) => ({
		setSelection: (selected: string) => dispatch({
			type: "ItemSelected",
			selected
		}),
		selectHovered: () => dispatch({ type: "SelectHovered" }),
		setFilter: (filter: string) => dispatch({
			type: "FilterChanged",
			filter,
			options
		}),
		onFocus: () => dispatch({
			type: "FocusChanged",
			focused: true
		}),
		onBlur: () => dispatch({
			type: "FocusChanged",
			focused: false
		}),
		incrementHover: () => dispatch({ type: "IncrementHover" }),
		decrementHover: () => dispatch({ type: "DecrementHover" }),
		optionsChanged: (options: List<[string, string]>) => dispatch({
			type: "OptionsChanged",
			options
		})
	});

	const initState = {
		options,
		filter: "",
		selected,
		focused: false,
		hovered: undefined
	};

	const store = Hoox.useStore(reducer, initState, onSelectMiddleware);
	const { state, actions } = Hoox.useHoox(store, (s) => s, mapDispatchToProps);

	React.useEffect(() => actions.optionsChanged(options), [props.options]);

	const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		let preventDefault = true;

		if (event.key.toLowerCase() == 'enter' || event.key.toLowerCase() == 'return') {
			if (state.hovered !== undefined)
				actions.selectHovered();
			else
				actions.setSelection(state.filter);

			preventDefault = false;
		}
		else if (event.key.toLowerCase() == 'tab') {
			if (state.hovered !== undefined)
				actions.selectHovered();

			preventDefault = false;
		}
		else if (event.key.toLowerCase() == "arrowdown")
			actions.incrementHover();
		else if (event.key.toLowerCase() == "arrowup")
			actions.decrementHover();
		else
			preventDefault = false;

		if (preventDefault)
			event.preventDefault();
	}

	return (
		<div
			onFocus={actions.onFocus}
			onBlur={actions.onBlur}
			style={{ position: "relative", borderBottom: "1px solid gray" }}
		>
			<TextInput
				value={state.focused ? state.filter : (state.selected || "")}
				placeholder="[Select]"
				onChange={(event) => actions.setFilter(event.target.value)}
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
							onSelect={actions.setSelection}
							hovered={state.hovered === i}
						/>
					)
				}
			</div>
		</div>
	);
}

export default DropDown;