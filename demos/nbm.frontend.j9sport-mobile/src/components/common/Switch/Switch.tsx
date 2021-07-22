import React from "react";
import mergeClass from "../../../utils/mergeClass";

function Switch(
	{
		checked = false,
		onChange,
		width = 34,
		height = 12
	}: {
		checked: boolean
		onChange?: Function
		width?: number
		height?: number
	}
) {
	return (
		<div
			className={
				mergeClass(
					"switch",checked && "switch_active"
				)}
			style={{
				width: width + "px",
				height: height + "px"
			}}
			onClick={() => {
				checked = !checked
				onChange
				&&
				onChange(checked)
			}}
		>
			<span className="switch-circle"></span>
		</div>
	)
}
export default Switch;