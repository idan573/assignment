import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { CreateProfileComponent } from 'features/CreateProfilePage/components/CreateProfileComponent';

type Props = RouteComponentProps;

const CreateProfileForm: React.FC<Props> = () => {
  const {
    actions: { trackPage }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'CreateProfilePage'
    });
  }, []);

  return <CreateProfileComponent />;
};

export default CreateProfileForm;
