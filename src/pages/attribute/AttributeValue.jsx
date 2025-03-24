
import React, { useEffect, useState } from 'react';
// import caseSheetService from '../../../../services/caseSheetService/caseSheet.service';
import { useDispatch, useSelector } from 'react-redux';


function AttributeValue({ selectedFinding, setSelectedFinding, isViewed }) {

  const dispatch = useDispatch();
  //   const { needToClear: isClrar,  count : count  } = useSelector((state) => state.clearToothAndDiagnosisSlice);

  console.log("selectedFinding", selectedFinding);


  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [complaint, setComplaint] = useState([]);
  const [focused, setFocused] = useState(false);


  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredOptions(
      complaint.filter(option => option.valueName.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const addTag = (tag) => {
    if (!tags.includes(tag.valueName) && tag.valueName.trim() !== '') {
      setTags([...tags, { valueName: tag.valueName, }]);
      setSelectedFinding([...selectedFinding, { valueName: tag.valueName }])
      setInputValue('');
      setFilteredOptions(complaint);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setSelectedFinding(selectedFinding.filter(tag => tag.valueName !== tagToRemove.valueName));
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selectedOption = filteredOptions.find(option => option.valueName.toLowerCase() === inputValue.toLowerCase());
      if (selectedOption) {
        addTag(selectedOption);
      } else {
        // const response = await caseSheetService.createFinding({ valueName: inputValue });
        // addTag({ valueName: inputValue, _id: response?.data?.data[0]._id });
        addTag({ valueName: inputValue, });
      }
    } else if (e.key === 'Backspace' && inputValue === '') {
      removeTag(tags[tags.length - 1]);
    }
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
          {tag?.valueName}
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
        onKeyDown={handleKeyPress}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 1000)} // Delay to allow click
        placeholder="Add task"
        className="flex-grow p-1 outline-none border-none bg-transparent"
      />
      {focused && filteredOptions.length > 0 && (
        <ul className="absolute top-[3rem] z-50 w-[100%] border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto dark:border-darkSecondary bg-white dark:bg-darkIconAndSearchBg shadow-lg">
          {filteredOptions.map((option, index) => (
            <button
              disabled={isViewed}
              key={index}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 cursor-pointer hover:text-info"
            >
              {option.valueName}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AttributeValue;