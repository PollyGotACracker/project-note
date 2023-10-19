import "@styles/settings/scoresDelete.css";
import { useSetRecoilState } from "recoil";
import { FaDatabase } from "react-icons/fa";
import { modalSelector } from "@recoils/global";
import SettingBox from "@components/settings/wrapper";
import ScoresDeleteContainer from "@components/settings/scoresDeleteContainer";
import Modal from "@components/modal";

const ScoresDelete = () => {
  const openModal = useSetRecoilState(modalSelector);

  return (
    <SettingBox
      icon={<FaDatabase />}
      title={"퀴즈 데이터 관리"}
      className={"scores-delete"}
    >
      <button onClick={() => openModal(true)}>목록 보기</button>
      <Modal content={<ScoresDeleteContainer />} />
    </SettingBox>
  );
};

export default ScoresDelete;
