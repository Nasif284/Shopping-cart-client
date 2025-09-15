import AdminTable from "./AdminTable";
import { CiCalendar } from "react-icons/ci";
import { Button } from "@mui/material";
import {
  useBlockUserMutation,
  useGetUsersQuery,
} from "../../Store/Api/admin/users";
import { userPlaceHolder } from "../../Assets";
import { useState } from "react";
import BlockConfirmModal from "./BlockConfirmModel";
const UsersColumns = [
  { id: "user", label: "User", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "phone", label: "Phone Number", minWidth: 100 },
  { id: "created", label: "Created At", minWidth: 100 },
  { id: "action", label: "Action", minWidth: 100, align: "center" },
];

function usersCreateData(user, email, phone, created, action) {
  return { user, email, phone, created, action };
}

const UsersTable = () => {
  const [blockUser, { isLoading: blockLoading }] = useBlockUserMutation();
  const [user, setUser] = useState();
  const [isBlocked, setIsBlocked] = useState();
  const [open, setOpen] = useState(false);
  const toggleBlock = (id, isBlocked) => {
    setUser(id);
    setOpen(true);
    setIsBlocked(isBlocked);
  };
  const { data, isLoading } = useGetUsersQuery();
  if (isLoading) {
    return <h1>Loading Users ...</h1>;
  }
  const UsersRows = data.users.map((user) =>
    usersCreateData(
      <div className="flex items-center gap-3">
        <div className="imgWrapper w-[35px] h-[35x] rounded-full overflow-hidden cursor-pointer">
          <img
            src={user.image || userPlaceHolder}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="info">
          <h3 className="text-[15px] font-[500] leading-5">{user.name}</h3>
        </div>
      </div>,
      user.email,
      user.mobile,
      <span className="flex gap-2 items-center">
        <CiCalendar className="text-[20px]" />
        {new Date(user.createdAt).toLocaleDateString()}
      </span>,
      user.isBlocked ? (
        <Button
          onClick={() => toggleBlock(user._id, user.isBlocked)}
          className="!bg-green-500 !text-white !capitalize !text-[12px]"
        >
          Unblock
        </Button>
      ) : (
        <Button
          onClick={() => toggleBlock(user._id, user.isBlocked)}
          className="!bg-red-500 !text-white !capitalize !text-[12px]"
        >
          Block
        </Button>
      )
    )
  );
  return (
    <>
      <AdminTable columns={UsersColumns} rows={UsersRows} />
      {open && (
        <BlockConfirmModal
          open={open}
          isBlocked={isBlocked}
          handleClose={() => setOpen(false)}
          id={user}
          isLoading={blockLoading}
          block={blockUser}
        />
      )}
    </>
  );
};

export default UsersTable;
