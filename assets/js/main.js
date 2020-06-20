(() => {
  let yOffset = 0,
    currentSection = 0,
    prevScroll = 0,
    delayedOffset = 0,
    ref = null,
    refState = false;
  const acc = 0.3;
  const sceneInfo = [
    {
      type: "sticky",
      scrollHeight: 0,
      scrollNum: 5,
      objs: {
        container: document.querySelector("#scroll-0"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        h1: document.querySelector("#scroll-0 h1"),
        messageA: document.querySelector(".main-msg.msg-one"),
        messageB: document.querySelector(".main-msg.msg-two"),
        messageC: document.querySelector(".main-msg.msg-three"),
        videoImage: [],
      },
      values: {
        imgCount: 500,
        imgSequence: [0, 499],
        letterSpace: [35, 20],
        canvasOpacity: [1, 0, { start: 0.9, end: 1 }],
        messageAOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        messageAOpacityOut: [1, 0, { start: 0.25, end: 0.35 }],
        messageBOpacityIn: [0, 1, { start: 0.4, end: 0.5 }],
        messageBOpacityOut: [1, 0, { start: 0.55, end: 0.65 }],
        messageCOpacityIn: [0, 1, { start: 0.7, end: 0.8 }],
        messageCOpacityOut: [1, 0, { start: 0.85, end: 0.95 }],
      },
    },
    {
      type: "sticky",
      scrollHeight: 0,
      scrollNum: 2,
      objs: {
        container: document.querySelector("#scroll-1"),
        highlightWrapper: document.querySelector(".highlight-wrapper"),
        imgA: document.querySelector("#seoul img"),
      },
      values: {
        imageOpacity: [0, 1, { start: 0, end: 0.1 }],
      },
    },
    {
      type: "sticky",
      scrollHeight: 0,
      scrollNum: 8,
      objs: {
        container: document.querySelector("#scroll-2"),
        elemA: document.querySelector("#bukchon"),
        elemB: document.querySelector("#changduk"),
        elemC: document.querySelector("#n-tower"),
        canvas: document.querySelector("#image-blending-canvas"),
        context: document
          .querySelector("#image-blending-canvas")
          .getContext("2d"),
        blendImages: ["./images/1.jpg", "./images/2.jpg", "./images/3.jpg"],
      },
      values: {
        elemAOpacityIn: [0, 1, { start: 0, end: 0.1 }],
        elemAOpacityOut: [1, 0, { start: 0.15, end: 0.25 }],
        elemATranslateIn: [-10, 0, { start: 0.0, end: 0.1 }],
        elemATranslateOut: [0, 10, { start: 0.15, end: 0.25 }],
        elemAZIndexUp: [0, 10, { start: 0.0, end: 0.1 }],
        elemAZIndexDown: [10, 0, { start: 0.15, end: 0.25 }],

        elemBOpacityIn: [0, 1, { start: 0.3, end: 0.4 }],
        elemBOpacityOut: [1, 0, { start: 0.45, end: 0.55 }],
        elemBTranslateIn: [-10, 0, { start: 0.3, end: 0.4 }],
        elemBTranslateOut: [0, 10, { start: 0.45, end: 0.55 }],
        elemBZIndexUp: [0, 10, { start: 0.3, end: 0.4 }],
        elemBZIndexDown: [10, 0, { start: 0.45, end: 0.55 }],

        elemCOpacityIn: [0, 1, { start: 0.6, end: 0.7 }],
        elemCOpacityOut: [1, 0, { start: 0.75, end: 1 }],
        elemCTranslateIn: [-10, 0, { start: 0.6, end: 0.7 }],
        elemCTranslateOut: [0, 10, { start: 0.75, end: 1 }],
        elemCZIndexUp: [0, 10, { start: 0.6, end: 0.7 }],
        elemCZIndexDown: [0, 10, { start: 0.75, end: 0.1 }],
      },
    },
    {
      type: "sticky",
      scrollHeight: 0,
      scrollNum: 1,
      objs: {
        container: document.querySelector("#scroll-3"),
      },
      values: {},
    },
  ];
  const setCanvasImages = () => {
    for (let i = 0; i < 500; i++) {
      const img = new Image(),
        cnt = String(1 + i);
      img.src = `./assets/video/videoplay/${
        cnt.length === 3
          ? `0${cnt}`
          : cnt.length === 2
          ? `00${cnt}`
          : `000${cnt}`
      }.jpg`;
      sceneInfo[0].objs.videoImage.push(img);
    }
    //console.log(sceneInfo[0].objs.videoImage);
    for (let i = 0; i < 3; i++) {
      const img = new Image();
      img.src = sceneInfo[2].objs.blendImages[i];
      sceneInfo[2].objs.blendImages[i] = img;
    }
  };
  const calcValues = (value, currentOffset) => {
    let rv;
    const scrollHeight = sceneInfo[currentSection].scrollHeight;
    const scrollRatio = currentOffset / scrollHeight; //스크롤 비율 계산
    if (value.length === 3) {
      const start = value[2].start * scrollHeight,
        end = value[2].end * scrollHeight,
        partScroll = end - start;
      if (currentOffset >= start && currentOffset <= end)
        //분할 구간 안
        rv =
          ((currentOffset - start) / partScroll) * (value[1] - value[0]) +
          value[0];
      else if (currentOffset < start) {
        //분할 구간 이전
        rv = value[0];
      } else if (currentOffset > end) {
        // 분할 구간 이후
        rv = value[1];
      }
    } else {
      rv = scrollRatio * (value[1] - value[0]) + value[0];
    }
    //console.log(rv);
    return rv;
  };
  const playAnimation = () => {
    const { scrollHeight, objs, values } = sceneInfo[currentSection];
    const currentOffset = yOffSet - prevScroll >= 0 && yOffSet - prevScroll;
    const scrollRatio = currentOffset / scrollHeight;
    //console.log(currentOffset, values.imgSequence);
    //console.log(currentOffset, yOffset);
    let sequence = values?.imgSequence
      ? Math.round(calcValues(values.imgSequence, currentOffset))
      : 0;
    switch (currentSection) {
      case 0:
        if (sequence >= values.imgCount) sequence = values.imgSequence[1];
        objs.context.drawImage(objs.videoImage[sequence], 0, 0);
        objs.canvas.style.opacity = `${calcValues(
          values.canvasOpacity,
          currentOffset
        )}`;
        if (scrollRatio <= 0.22) {
          objs.messageA.style.opacity = `${calcValues(
            values.messageAOpacityIn,
            currentOffset
          )}`;
        } else {
          objs.messageA.style.opacity = `${calcValues(
            values.messageAOpacityOut,
            currentOffset
          )}`;
        }
        if (scrollRatio <= 0.52) {
          objs.messageB.style.opacity = `${calcValues(
            values.messageBOpacityIn,
            currentOffset
          )}`;
        } else {
          objs.messageB.style.opacity = `${calcValues(
            values.messageBOpacityOut,
            currentOffset
          )}`;
        }
        if (scrollRatio <= 0.82) {
          objs.messageC.style.opacity = `${calcValues(
            values.messageCOpacityIn,
            currentOffset
          )}`;
        } else {
          objs.messageC.style.opacity = `${calcValues(
            values.messageCOpacityOut,
            currentOffset
          )}`;
        }
        break;
      case 1:
        //console.log(objs.highlightWrapper.offsetTop, objs.elemA.offsetTop);
        objs.imgA.style.opacity = `${calcValues(
          values.imageOpacity,
          currentOffset
        )}`;
        sceneInfo[2].objs.canvas.style.opacity = "0";
        break;
      case 2:
        //const widthRatio = window.innerWidth / objs.canvas.width,
        //heightRatio = window.innerHeight / objs.canvas.height;
        //canvas 이미지 전환
        if (scrollRatio <= 0.25) {
          objs.context.drawImage(
            objs.blendImages[0],
            0,
            0,
            objs.canvas.width,
            objs.canvas.height
          );
        } else if (scrollRatio <= 0.55) {
          objs.context.drawImage(
            objs.blendImages[1],
            0,
            0,
            objs.canvas.width,
            objs.canvas.height
          );
        } else if (scrollRatio <= 0.85) {
          objs.context.drawImage(
            objs.blendImages[2],
            0,
            0,
            objs.canvas.width,
            objs.canvas.height
          );
        }
        //구간별 효과
        if (scrollRatio <= 0.12) {
          objs.canvas.style.opacity = `${calcValues(
            values.elemAOpacityIn,
            currentOffset
          )}`;
          objs.elemA.style.opacity = `${calcValues(
            values.elemAOpacityIn,
            currentOffset
          )}`;
          objs.elemA.style.transform = `translate3d(0,${calcValues(
            values.elemATranslateIn,
            currentOffset
          )}%,0)`;
          objs.elemA.style.zIndex = `${calcValues(
            values.elemAZIndexUp,
            currentOffset
          )}`;
        } else {
          objs.canvas.style.opacity = `${calcValues(
            values.elemAOpacityOut,
            currentOffset
          )}`;
          objs.elemA.style.opacity = `${calcValues(
            values.elemAOpacityOut,
            currentOffset
          )}`; //opacity 1~0
          objs.elemA.style.transform = `translate3d(0,${calcValues(
            values.elemATranslateOut,
            currentOffset
          )}%,0)`; //translate 변환
          objs.elemA.style.zIndex = `${calcValues(
            values.elemAZIndexDown,
            currentOffset
          )}`; //z-index 10~0
        }
        if (scrollRatio <= 0.42) {
          if (scrollRatio >= 0.3) {
            objs.canvas.style.opacity = `${calcValues(
              values.elemBOpacityIn,
              currentOffset
            )}`;
          }
          objs.elemB.style.opacity = `${calcValues(
            values.elemBOpacityIn,
            currentOffset
          )}`;
          objs.elemB.style.transform = `translate3d(0,${calcValues(
            values.elemBTranslateIn,
            currentOffset
          )}%,0)`;
          objs.elemB.style.zIndex = `${calcValues(
            values.elemBZIndexUp,
            currentOffset
          )}`;
        } else {
          objs.canvas.style.opacity = `${calcValues(
            values.elemBOpacityOut,
            currentOffset
          )}`;
          objs.elemB.style.opacity = `${calcValues(
            values.elemBOpacityOut,
            currentOffset
          )}`;
          objs.elemB.style.transform = `translate3d(0,${calcValues(
            values.elemBTranslateOut,
            currentOffset
          )}%,0)`;
          objs.elemB.style.zIndex = `${calcValues(
            values.elemBZIndexDown,
            currentOffset
          )}`;
        }
        if (scrollRatio <= 0.72) {
          if (scrollRatio >= 0.6) {
            objs.canvas.style.opacity = `${calcValues(
              values.elemCOpacityIn,
              currentOffset
            )}`;
          }
          objs.elemC.style.opacity = `${calcValues(
            values.elemCOpacityIn,
            currentOffset
          )}`;
          objs.elemC.style.transform = `translate3d(0,${calcValues(
            values.elemCTranslateIn,
            currentOffset
          )}%,0)`;
          objs.elemC.style.zIndex = `${calcValues(
            values.elemCZIndexUp,
            currentOffset
          )}`;
        } else {
          objs.canvas.style.opacity = `${calcValues(
            values.elemCOpacityOut,
            currentOffset
          )}`;
          objs.elemC.style.opacity = `${calcValues(
            values.elemCOpacityOut,
            currentOffset
          )}`;
          objs.elemC.style.transform = `translate3d(0,${calcValues(
            values.elemCTranslateOut,
            currentOffset
          )}%,0)`;
          objs.elemC.style.zIndex = `0`;
        }
        break;
    }
  };
  const setLayout = () => {
    let totalScroll = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = window.innerHeight * sceneInfo[i].scrollNum;
        sceneInfo[
          i
        ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
      } else {
        //console.log(sceneInfo[i].objs.container.offsetHeight);
        sceneInfo[i].scrollHeight = 100;
        sceneInfo[
          i
        ].objs.container.style.height = `${sceneInfo[i].scrollHeight}%`;
      }
    }
    yOffSet = window.pageYOffset;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScroll += sceneInfo[i].scrollHeight;
      if (yOffset <= totalScroll) {
        currentSection = i;
        break;
      }
    }
    //const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0px) `;
  };
  const scrollEvent = () => {
    prevScroll = 0;
    for (let i = 0; i < currentSection; i++) {
      prevScroll += sceneInfo[i].scrollHeight;
    }
    //console.log(delayedOffset, pageYOffset);
    if (delayedOffset > prevScroll + sceneInfo[currentSection].scrollHeight) {
      currentSection += 1;
    } else if (delayedOffset >= 0 && delayedOffset <= prevScroll) {
      currentSection > 0 && currentSection--;
    }
    if (document.body.getAttribute("id") !== `show-section-${currentSection}`) {
      document.body.setAttribute("id", `show-section-${currentSection}`);
    } else {
      playAnimation();
    }
  };
  const handleScroll = (e) => {
    yOffSet = window.pageYOffset;
    scrollEvent();
    if (!refState) {
      requestAnimationFrame(loop);
      refState = true;
    }
  };
  const loop = () => {
    delayedOffset = delayedOffset + (window.pageYOffset - delayedOffset) * acc;
    if (currentSection === 0) {
      const { values, objs } = sceneInfo[currentSection],
        currentOffset = delayedOffset - prevScroll;
      let sequence = values?.imgSequence
        ? Math.round(calcValues(values.imgSequence, currentOffset))
        : 0;
      if (objs.videoImage[sequence])
        objs.context.drawImage(objs.videoImage[sequence], 0, 0);
    }
    ref = requestAnimationFrame(loop); //requestAnimationFrame 실행
    if (Math.abs(window.pageYOffset - delayedOffset) < 1) {
      //pageYOffset 값과 delatOffset 값이 거의 비슷해질 경우
      //console.log("cancel");
      cancelAnimationFrame(ref); //AnimationFrame 취소
      refState = false;
    }
  };
  const init = () => {
    window.addEventListener("load", () => {
      const {
        objs: { context, videoImage },
      } = sceneInfo[0];
      document.body.classList.remove("loading");
      setLayout();
      context.drawImage(videoImage[0], 0, 0);
      document.body.setAttribute("id", `show-section-${currentSection}`);
      window.addEventListener("resize", () => {
        setLayout();
      });
      window.addEventListener("scroll", handleScroll);
      document
        .querySelector(".loading-container")
        .addEventListener("transitionend", (e) => {
          document.body.removeChild(e.currentTarget);
        });
      window.addEventListener("orientationchange", setLayout);
    });
    setCanvasImages();
  };
  init();
})();
