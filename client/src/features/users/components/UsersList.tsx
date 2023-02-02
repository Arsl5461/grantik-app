import { Table, Spinner } from '../../../components/Elements';
import { formatDate } from '../../../utils/format';

import { useUsers } from '../api/getUsers';
import { User } from '../types';

import { DeleteUser } from './DeleteUser';

export const UsersList = () => {
  const usersQuery = useUsers();

  if (usersQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!usersQuery.data) return null;

  return (
    <Table<User>
      data={usersQuery.data}
      columns={[
        {
          title: 'Notendanafn',
          field: 'username',
        },
        {
          title: 'Netfang',
          field: 'email',
        },
        {
          title: 'Hlutverk',
          field: 'role',
        },
        {
          title: 'Búið til kl',
          field: 'createdAt',
          Cell({ entry: { createdAt } }: any) {
            return <span>{formatDate(createdAt)}</span>;
          },
        },
        {
          title: '',
          field: 'id',
          Cell({ entry: { _id } }: any) {
            return <DeleteUser id={_id} />;
          },
        },
      ]}
    />
  );
};
