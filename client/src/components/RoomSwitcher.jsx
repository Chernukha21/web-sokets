import { useSelector } from "react-redux";
import { joinRoom, leaveRoom } from "../api/ws";

const RoomSwitcher = () => {
  const { rooms, activeRoom } = useSelector((state) => state.chat);

  const changeRoom = (nextRoom) => {
    if (nextRoom === activeRoom) {
      return;
    }

    leaveRoom(activeRoom);
    joinRoom(nextRoom);
  };

  return (
    <nav className="room-switcher">
      {rooms.map((room) => (
        <button
          className={
            room === activeRoom
              ? "room-button room-button--active"
              : "room-button"
          }
          key={room}
          type="button"
          onClick={() => changeRoom(room)}
        >
          # {room}
        </button>
      ))}
    </nav>
  );
};

export default RoomSwitcher;
