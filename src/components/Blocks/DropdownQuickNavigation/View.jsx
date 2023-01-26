/* eslint-disable jsx-a11y/no-onchange */
import { ConditionalLink } from '@plone/volto/components';
import * as React from 'react';
import './DropdownQuickNavigation.css';

function QuickNavDropdown({
  label,
  options,
  optionValues = null,
  valueField,
  currentValue = null,
  onChange,
  disabled = null,
}) {
  const selectId = `nsw-quicknavdropdown-${label?.replaceAll(' ', '-')}`;

  return (
    <div className="nsw-form__group">
      {/* TODO: There's a margin between these two, so there's an un-clickable area */}
      <label className="nsw-form__label" htmlFor={selectId}>
        {label}
      </label>
      <select
        value={currentValue ?? null}
        onChange={onChange}
        className="nsw-form__select"
        id={selectId}
        disabled={!!disabled ? true : null}
      >
        {options.map((link, i) => {
          return (
            <option
              key={link[valueField]}
              value={optionValues !== null ? optionValues[i] : link[valueField]}
            >
              {link[valueField]}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function DropdownQuickNavigationView({ data, isEditMode = false }) {
  const [firstDropdownValue, setFirstDropdownValue] = React.useState(
    data.links?.[0]?.dropdownValueFirst ?? '',
  );
  const [goToLink, setGoToLink] = React.useState(
    data.links?.[0]?.link?.[0]['@id'] ?? '',
  );

  const firstDropdownOptions = React.useMemo(() => {
    if (!data.links) {
      return [];
    }
    return data.links.reduce((result, currentLink, index) => {
      let newResult = index > 1 ? [...result] : [result];
      if (
        !newResult.findIndex(
          (option) =>
            option.firstDropdownValue === currentLink.firstDropdownValue,
        )
      ) {
        newResult.push(currentLink);
      }
      return newResult;
    });
  }, [data.links]);
  const secondDropdownOptions = React.useMemo(() => {
    if (!data.links) {
      return [];
    }

    return data.links.reduce((result, currentLink, index) => {
      let newResult = Array.isArray(result) ? result : [];
      if (index === 1 && result.dropdownValueFirst === firstDropdownValue) {
        newResult.push(result);
      }
      const alreadyExist =
        newResult.findIndex(
          (option) =>
            option.dropdownValueFirst !== currentLink.dropdownValueFirst,
        ) !== -1;
      if (
        !alreadyExist &&
        currentLink.dropdownValueFirst === firstDropdownValue
      ) {
        newResult.push(currentLink);
      }
      return newResult;
    });
  }, [data.links, firstDropdownValue]);

  return (
    <div className="nswds-dropdownQuickNavigation">
      {/* TODO: I'm not quite sure on the HTML here :( */}
      {/* TODO: Progressive enhancement */}
      <form className="nsw-form nswds-dropdownQuickNavigation">
        <QuickNavDropdown
          label={data.dropdownTitleFirst}
          options={firstDropdownOptions}
          valueField="dropdownValueFirst"
          currentValue={firstDropdownValue}
          onChange={(event) => {
            setFirstDropdownValue(event.target.value);
          }}
          disabled={isEditMode}
        />
        <QuickNavDropdown
          label={data.dropdownTitleSecond}
          options={secondDropdownOptions}
          optionValues={secondDropdownOptions.map((option) => {
            return option.link[0]['@id'];
          })}
          valueField="dropdownValueSecond"
          onChange={(event) => {
            setGoToLink(event.target.value);
          }}
          disabled={isEditMode}
        />
      </form>
      {goToLink ? (
        <ConditionalLink
          condition={!isEditMode}
          to={goToLink}
          className={`nsw-button ${
            data.invert ? 'nsw-button--white' : 'nsw-button--dark'
          }`}
        >
          Go
        </ConditionalLink>
      ) : null}
    </div>
  );
}
