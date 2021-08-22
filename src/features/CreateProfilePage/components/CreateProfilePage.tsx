import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { CreateProfileComponent } from './CreateProfileComponent';

type Props = RouteComponentProps;

const CreateProfilePage: React.FC<Props> = ({ location, history }: Props) => {
  const {
    state: { activeTaskData },
    actions: { trackPage }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'CreateProfilePage'
    });
  }, []);

  const handleOnSubmit = React.useCallback(() => {
    history.push({
      pathname: activeTaskData?.taskName
        ? `/task-chat/${activeTaskData.taskName}`
        : '/homepage',
      search: location.search
    });
  }, []);

  return <CreateProfileComponent onSubmit={handleOnSubmit} />;
};

export default CreateProfilePage;
