import { useEffect } from "react";
import "../../css/Quiz/QuizMain.css";

const QuizMain = () => {
  useEffect(() => {
    (async () => {
      const res = await fetch(`/quiz/rnd/get`).then((data) => data.json());
      console.log(res);
    })();
  }, []);

  // useEffect(() => {
  //   document.querySelector("input").focus();
  //   fetchs();
  // }, [fetchs]);

  return (
    <article className="Quiz">
      <section className="left-sidebar">
        <div className="subject-box">
          <div className="title">&#183; 주제 &#183;</div>
          <div className="card">테스트</div>
        </div>
        <div className="keyword-box">
          <div className="title">&#183; 키워드 &#183;</div>
        </div>
        <div className="keyword-length">5</div>
      </section>
      <section className="center">
        <div className="msg-box">
          <input className="msg" placeholder="키워드를 입력하세요!"></input>
        </div>
        <div className="bird-img">사진 영역</div>
      </section>
    </article>
  );
};

export default QuizMain;
