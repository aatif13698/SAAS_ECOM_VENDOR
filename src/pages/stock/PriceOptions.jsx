
import { price } from '@/constant/data';
import React, { useEffect, useState } from 'react';
// import caseSheetService from '../../../../services/caseSheetService/caseSheet.service';
import { useDispatch, useSelector } from 'react-redux';


function PriceOptions({activePriceOptions, selectedFinding, setSelectedFinding, isViewed }) {

  const dispatch = useDispatch();
  //   const { needToClear: isClrar,  count : count  } = useSelector((state) => state.clearToothAndDiagnosisSlice);

  console.log("activePriceOptions",activePriceOptions);
  

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [complaint, setComplaint] = useState([]);
  const [focused, setFocused] = useState(false);


  useEffect(() => {
    setFilteredOptions(activePriceOptions);
    // setTags([]);
    // setSelectedFinding([])
  },[activePriceOptions])


  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const addTag = (tag) => {
    if (!tags.includes({price: tag.price, quantity : tag.quantity, unit : tag.unit})) {
      setTags([...tags, {price: tag.price, quantity : tag.quantity, unit : tag.unit}]);
      setSelectedFinding([...selectedFinding, {price: tag.price, quantity : tag.quantity, unit : tag.unit}])
      setFilteredOptions(filteredOptions.filter((option) => {
        if(option.price !== tag.price &&  option.quantity !== tag.quantity  ){
          return option
        }
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => {
      if(tagToRemove.price !== tag.price &&  tagToRemove.quantity !== tag.quantity){
        return tag
      }
    }));
    setFilteredOptions((prev) => ([...prev,tagToRemove ]));
    setSelectedFinding(selectedFinding.filter((option) => {
      if(option.price !== tagToRemove.price &&  option.quantity !== tagToRemove.quantity  ){
        return option
      }
    }));
  };

  const handleOptionClick = (option) => {
    addTag(option);
    setFocused(false);
  };

  useEffect(() => {

    if (selectedFinding) {
      setTags(selectedFinding)
    }

  }, [selectedFinding])

  // get complaitns 
  //   useEffect(() => {
  //     async function getFinding() {
  //       try {
  //         const response = await caseSheetService.getFinding();
  //         setFilteredOptions(response?.data);
  //         setComplaint(response?.data)
  //         // dispatch(setComplaintData([...response?.data]))
  //       } catch (error) {
  //         console.log("error while getting the complaint", error);
  //       }
  //     }
  //     getFinding()
  //   }, [])


  //   useEffect(() => {
  //     if (isClrar) {
  //       setTags([])
  //     }
  //   }, [ count])


  return (
    <div
      className="flex form-control py-1 relative flex-wrap items-center border border-lightBorderColor rounded-md  dark:border-darkSecondary"
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 m-1"
        >
          {tag.price}/{tag.quantity}/{tag.unit}
          <button
            disabled={isViewed}
            onClick={() => removeTag(tag)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        disabled={isViewed}
        onChange={handleInputChange}
        // onKeyDown={handleKeyPress}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 1000)} // Delay to allow click
        placeholder="select optins"
        className="flex-grow p-1 outline-none border-none bg-transparent"
      />
      {focused && filteredOptions.length > 0 && (
        <ul className="absolute top-[3rem] z-50 w-[100%] border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto dark:border-darkSecondary bg-white dark:bg-darkIconAndSearchBg shadow-lg">
          {filteredOptions.map((option, index) => (

            <li  key={index}>
                <button
              disabled={isViewed}
             
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 cursor-pointer hover:text-info"
            >
              {option.price}/{option.quantity}/{option.unit}
            </button>

            </li>
            
          ))}
        </ul>
      )}
    </div>
  );
}

export default PriceOptions;