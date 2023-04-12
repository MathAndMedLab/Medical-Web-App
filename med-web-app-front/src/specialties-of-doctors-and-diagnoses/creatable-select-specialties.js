import CreatableSelect from "react-select/creatable";
import specialtiesList from "./specialties-of-doctors";
import React from "react";
const creatableSelectStyle = {
    control: base => ({
        ...base,
        minHeight: 55
    })
};

export default ((value, setValue) => {return (
    <CreatableSelect
        maxMenuHeight={190}
        placeholder="Выберите специальность..."
        formatCreateLabel={(x) => `Выбрать ${x}`}
        noOptionsMessage={() => "Выбраны все специальности."}
        options={specialtiesList}
        isSearchable={true}
        isMulti
        styles={creatableSelectStyle}
        value={value}
        onChange={(e) => setValue(e)}
    />)})