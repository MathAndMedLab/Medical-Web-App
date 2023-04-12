import diagnosesList from "./diagnoses";
import CreatableSelect from "react-select/creatable";
import React from "react";
const creatableSelectStyle = {
    control: base => ({
        ...base,
        height: 55,
        minHeight: 55
    })
};
export default ((value, setValue) => {return (
    <CreatableSelect
        maxMenuHeight={190}
        placeholder="Выберите болезнь..."
        formatCreateLabel={(x) => `Выбрать ${x}`}
        noOptionsMessage={() => "Выбраны все болезни."}
        options={diagnosesList}
        value={value}
        onChange={(e) => setValue(e)}
        isSearchable={true}
        isMulti
        styles={creatableSelectStyle}
    />)})