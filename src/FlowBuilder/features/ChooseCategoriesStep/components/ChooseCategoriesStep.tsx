import * as React from 'react';
import { Loader } from '@bit/scalez.savvy-ui.loader';

/* Types */
import { FlowRouteProps } from 'FlowBuilder/types';

/* Components */
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';
import { ChooseCategoriesComponent } from 'features/ChooseCategoriesPage/components/ChooseCategoriesComponent';

const ChooseCategoriesStep: React.FC<FlowRouteProps> = ({
  currentFlowState,
  onNext
}: FlowRouteProps) => {
  const {
    actions: { setFlowState }
  } = React.useContext<FlowContextType>(FlowContext);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );

  const handleNext = React.useCallback(() => {
    setFlowState({ selectedCategories });
    onNext();
  }, [selectedCategories]);

  return (
    <>
      {currentFlowState?.categories?.length ? (
        <ChooseCategoriesComponent
          handleNextClick={handleNext}
          categories={currentFlowState?.categories}
          activeCategories={selectedCategories}
          setActiveCategories={setSelectedCategories}
          maxCategoriesCount={currentFlowState?.maxCategoriesCount ?? 3}
        />
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ChooseCategoriesStep;
