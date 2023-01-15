import "../../css/Voca/VocaWrite.css";
import {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import { useParams, Link } from "react-router-dom";
import { useVocaContext } from "../../context/VocaContext.js";
import uuid from "react-uuid";

const VocaWrite = () => {
  const keyboxRef = useRef(null);
  const { catid, subid } = useParams();
  const { vocaSub, setVocaSub, vocaKey, setVocaKey } = useVocaContext();
  const [keywordList, setKeywordList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [keyIndex, setKeyIndex] = useState(1);

  const KeywordItem = () => {
    setKeyIndex(keyIndex + 1);
    return (
      <div className="keyword-item" key={keyIndex}>
        <div className="keyword-index">{keyIndex}</div>
        <div className="wrap-keyword">
          <input
            className="keyword"
            name="k_keyword"
            type="text"
            autoFocus
            autoComplete="false"
            spellCheck="false"
            onChange={onChangeKeyHandler}
          />
          <textarea
            className="desc"
            name="k_desc"
            autoComplete="false"
            spellCheck="false"
            onChange={onChangeKeyHandler}
          />
        </div>
      </div>
    );
  };

  // keywordItem 추가
  const addKeyword = useCallback(() => {
    const item = KeywordItem();
    setKeywordList([item, ...keywordList]);
  }, [keywordList, setKeywordList]);

  const OnChangeAttHandler = useCallback(
    (e) => {
      const fileData = Array.from(e.target.files);
      console.log(fileData);
      const uploadFiles = fileData.map((file) => {
        const item = {
          url: URL.createObjectURL(file),
          a_original_name: file.name,
          a_ext: file.type,
        };
        return item;
      });
      console.log(uploadFiles);
      setFileList([...uploadFiles]);
    },
    [fileList]
  );

  // fetch
  const fetchs = useCallback(async () => {
    try {
      let res = await fetch(`/voca/cat/write/${catid}`);
      res = await res.json();
      if (res.error) {
        alert(res.error);
      } else {
        // vocaSub 에 category 추가 및 해당 태그에 데이터 표시
        setVocaSub({ ...vocaSub, s_category: res[0].c_category });
      }
      // path 에 subid 가 있을 경우(UPDATE)
      if (subid) {
        let res = await fetch(`/voca/sub/${subid}`);
        res = await res.json();
        if (res.error) {
          alert(res.error);
        } else {
          setVocaSub({ ...res.subject[0] });
          // let keywords = res.keywords;
          // keywords = keywords.map((keyword) => {
          //   const input = addInput();
          //   input.value = keyword.k_keyword;
          //   console.log(input);
          //   return input;
          // });
          // const parent = document.querySelector("#keyword-box");
          // parent.prepend(...keywords);
        }
      }
    } catch (error) {
      console.log(error);
      alert("서버 연결에 문제가 발생했습니다.");
    }
  }, [catid, setVocaSub, subid]);

  useLayoutEffect(() => {
    (async () => {
      await fetchs();
      const item = KeywordItem();
      setKeywordList([item, ...keywordList]);
    })();
  }, [fetchs]);

  // useEffect 내에서 console, 이후 밖에서 console 을 찍으면
  // 밖에 있는 console 이 먼저 실행되고, useEffect 는 rendering 이후 실행되므로 console 이 나중에 실행된다.

  // change event 가 없으면 값이 추가가 안됨
  const onChangeSubHandler = (e) => {
    setVocaSub({ ...vocaSub, [e.target.name]: e.target.value });
  };
  // keyword 하나당 state 변수를 생성할 수 있는지... 전혀 필요없는 코드
  const onChangeKeyHandler = (e) => {
    setVocaKey({ ...vocaKey, [e.target.name]: e.target.value });
  };

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        console.log(keywordList);
        const keyInputs = Array.from(document.querySelectorAll(".keyword"));
        const keyTexts = Array.from(document.querySelectorAll(".desc"));
        const keywordInputs = keyInputs
          .map((input) => {
            if (input.value !== "") {
              return input.value;
            }
          })
          .filter((value) => value);
        let method = "POST";
        let url = `/voca/sub/insert`;
        let subjects = { ...vocaSub, s_catid: catid };
        let keywords = keywordInputs;
        console.log(keywords);
        // files 가 빈 배열로 뜸
        let files = fileList;
        if (subid) {
          method = "PUT";
          url = `/voca/sub/update`;
          subjects = { ...vocaSub, s_subid: subid };
        }
        const fetchOption = {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjects, keywords, files }),
        };
        let res = await fetch(url, fetchOption);
        res = await res.json();
        alert(res.result);
      } catch (error) {
        console.log(error);
        alert("서버에 문제가 발생했습니다.\n다시 시도해주세요.");
      }
      // window.location.href = `/voca/subject/${catid}/${vocaSub.s_subid}`;
    },
    [vocaSub, catid, subid]
  );

  return (
    <main className="Write">
      <form>
        <label htmlFor="category">카테고리</label>
        <input
          id="category"
          name="s_category"
          value={vocaSub.s_category}
          readOnly={true}
          onChange={onChangeSubHandler}
        />
        <label htmlFor="subject">주제</label>
        <input
          id="subject"
          value={vocaSub.s_subject || ""}
          name="s_subject"
          onChange={onChangeSubHandler}
          autoComplete="false"
        />
        <div className="keyword-controller">
          <label>키워드</label>
          <button id="add-keyword" type="button" onClick={addKeyword}>
            키워드 추가
          </button>
        </div>
        <div id="keyword-box" ref={keyboxRef}>
          {keywordList}
        </div>

        <div className="attach-box">
          <label htmlFor="attach">첨부</label>
          <input
            type="file"
            id="attach"
            name="attach"
            accept="image/*"
            multiple
            onChange={OnChangeAttHandler}
          />
        </div>
        <div className="btn-box">
          <Link id="back" to={`/voca/subject/${catid}/${subid}`}>
            뒤로
          </Link>
          <button type="button" id="submit" onClick={submitHandler}>
            등록
          </button>
        </div>
      </form>
    </main>
  );
};

export default VocaWrite;
