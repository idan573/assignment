import * as React from 'react';
import { ProductTypeButton } from '@bit/scalez.savvy-ui.product-type-button';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Styles */
import { StyledChooseCategoriesComponent } from './styles';

export interface Props {
  maxCategoriesCount: number;
  categories: string[];
  activeCategories: string[]; //TODO: Add isActive flag
  setActiveCategories: (categories: string[]) => void;
  handleNextClick: () => void;
}

const ChooseCategoriesComponent: React.FC<Props> = React.memo(
  ({
    maxCategoriesCount,
    categories,
    activeCategories,
    setActiveCategories,
    handleNextClick
  }: Props) => {
    const handleCategoryClick = React.useCallback(
      (name: string) => {
        const newActiveCategories = activeCategories.includes(name)
          ? activeCategories.filter(category => category !== name)
          : [...activeCategories, name];

        setActiveCategories(newActiveCategories);
      },
      [activeCategories]
    );

    return (
      <>
        <StyledChooseCategoriesComponent>
          <div className="content-wrapper">
            <div className="text-block">
              <h2>What are you looking for?</h2>

              {maxCategoriesCount === 1 ? (
                <p className="body">Select clothing category</p>
              ) : (
                <p className="body">
                  Select up to {maxCategoriesCount} clothing categories
                </p>
              )}
            </div>

            <div className="categories-block">
              {categories?.map((name: string, index: number) => (
                <ProductTypeButton
                  key={index}
                  name={name}
                  size="big"
                  disabled={
                    activeCategories.length === maxCategoriesCount &&
                    !activeCategories.includes(name)
                  }
                  isActive={activeCategories.includes(name)}
                  onClick={() => handleCategoryClick(name)}
                />
              ))}
            </div>
          </div>

          <Button
            className="next-button"
            data-action="next"
            data-action-position="right"
            disabled={!activeCategories.length}
            onClick={handleNextClick}
          >
            Next
          </Button>
        </StyledChooseCategoriesComponent>
      </>
    );
  }
);

export { ChooseCategoriesComponent };
