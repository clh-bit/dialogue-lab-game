"use strict";

// Story comics: four equal panels in a 2 × 2 grid.
const PANELS = [
  [0, 0, 0.5, 0.5],
  [0.5, 0, 1, 0.5],
  [0, 0.5, 0.5, 1],
  [0.5, 0.5, 1, 1]
];

// Choice comics: preserve the full image as three vertical columns.
const CARDS = [
  [0, 0, 1 / 3, 1],
  [1 / 3, 0, 2 / 3, 1],
  [2 / 3, 0, 1, 1]
];

const scenes = [
  {
    title: "朋友沒有等我",
    file: "friend-conflict",
    intro:
      "朋友沒有等你就離開了。你很生氣，也很重視這段友誼。",

    labels: [
      "A｜指責",
      "B｜冷處理",
      "C｜表達感受"
    ],

    words: [
      "你根本不當我是朋友！",
      "算了，我不想說了。",
      "你沒有等我時，我覺得被忽略。下次可以先告訴我嗎？"
    ],

    feedback: [
      [
        "被朋友留下，可能真的會讓你生氣或受傷。你想讓對方知道這段友誼很重要，這份心情值得被聽見。",
        "可以把「你根本……」改成具體發生的事，再說自己的感受。",
        "可以試說：「你沒有等我就離開時，我有點失望。下次可以先告訴我嗎？」"
      ],
      [
        "你可能需要時間整理心情，現在不想說也可以。",
        "可以告訴對方你需要暫停，而不是讓對方猜測。",
        "可以試說：「我現在有點生氣，想先冷靜一下。等我準備好，我們再談。」"
      ],
      [
        "你把感受和希望說清楚了，這是值得肯定的一步。",
        "說完後，也可以留一點空間聽聽對方的解釋。對方沒有立即理解，不代表你表達得不好。",
        "可以接著說：「當時發生了甚麼事？我也想聽聽你的想法。」"
      ]
    ],

    parts: [
      ["你沒有等我就離開時", "你總是這樣"],
      ["我覺得失望", "你很討厭"],
      ["下次可以先告訴我嗎？", "你永遠不要找我！"]
    ]
  },

  {
    title: "我的界線，我來說",
    file: "relationship-boundaries",
    intro:
      "對方的接觸讓你不舒服。你可以決定自己的界線。",

    labels: [
      "A｜直接拒絕",
      "B｜默默忍耐",
      "C｜說明界線"
    ],

    words: [
      "不要靠近我，請停下！",
      "沒關係……（其實不舒服）",
      "我不想這樣接觸，請保持距離。"
    ],

    feedback: [
      [
        "你清楚說出了「停止」，你的界線值得被尊重。",
        "不需要為了顯得有禮貌而接受不舒服的接觸。下一步是確認自己是否安全。",
        "如果對方沒有停止，可以離開現場，向可信任的老師、家人或支援者求助。"
      ],
      [
        "當下不知道怎樣拒絕，或一時說不出話，不代表你做錯了。你不需要責怪自己。",
        "你仍然可以在之後說出界線，也可以請人陪你表達。",
        "可以試說：「剛才我沒有說清楚，但其實我不舒服。我不想再有這樣的接觸。」"
      ],
      [
        "你把自己的需要說清楚了，這值得肯定。",
        "留意對方是否真的停止。如果對方繼續施壓，不是你需要說得更好，而是可以尋求支援。",
        "重視一段關係，不代表要放下自己的界線。"
      ]
    ],

    parts: [
      ["當你繼續靠近時", "你每次都這樣"],
      ["我感到不舒服", "你一定是故意的"],
      ["請停止並保持距離。", "請先問我是否願意。"]
    ]
  },

  {
    title: "功課卡關了",
    file: "homework",
    intro:
      "功課做不出來，家人又在催促。你希望得到幫助。",

    labels: [
      "A｜發脾氣",
      "B｜逃避",
      "C｜尋求協助"
    ],

    words: [
      "我不會！你自己做好了！",
      "（推開書本，不回應）",
      "這題我卡住了，可以一起拆成小步驟嗎？"
    ],

    feedback: [
      [
        "卡住又被催促，可能會讓你很挫折。一次發脾氣不代表你不努力，也不代表你沒有能力。",
        "先停一停，再指出需要幫忙的地方。",
        "可以試說：「我不知道第一步怎樣做。可以讓我停一下，再陪我看第一步嗎？」"
      ],
      [
        "你可能已經很累，或不知道怎樣開始。需要休息不等於放棄。",
        "可以說明要休息多久，以及回來後願意試的小步驟。",
        "可以試說：「我先休息五分鐘，之後先做第一小題。卡住時可以再問你嗎？」"
      ],
      [
        "你說出了困難，並邀請別人一起找方法。求助是尋找下一步，不代表能力不足。",
        "可以再指出已經做到哪裡，以及從哪裡開始不明白。",
        "可以接著說：「題目我看得懂，但不知道要用哪個方法。我們先看這部分可以嗎？」"
      ]
    ],

    parts: [
      ["做到這一題時", "你一直在煩我"],
      ["我覺得很挫折", "你根本不懂"],
      [
        "可以一起看第一步嗎？",
        "可以讓我休息五分鐘再繼續嗎？"
      ]
    ]
  }
];

const $ = id => document.getElementById(id);
const screen = $("screen");
const imageCache = new Map();
const STORAGE_KEY = "story-lab-v4-auto-feedback";

function freshState() {
  return {
    i: 0,
    step: 0,
    feelings: [null, null, null],
    answers: [null, null, null],
    builds: [null, null, null]
  };
}

let state = freshState();
let pendingAnswer = null;
let renderVersion = 0;

function isValidState(value) {
  return (
    value &&
    Number.isInteger(value.i) &&
    value.i >= 0 &&
    value.i < scenes.length &&
    Number.isInteger(value.step) &&
    value.step >= 0 &&
    value.step < 6 &&
    ["feelings", "answers", "builds"].every(
      key =>
        Array.isArray(value[key]) &&
        value[key].length === scenes.length
    ) &&
    value.answers.every(
      answer =>
        answer === null ||
        (
          Number.isInteger(answer) &&
          answer >= 0 &&
          answer < 3
        )
    )
  );
}

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (isValidState(saved)) {
    state = saved;

    if (
      state.step === 4 &&
      state.answers[state.i] === null
    ) {
      state.step = 3;
    }
  }
} catch (_) {
  // Continue without saved progress.
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {
    // The game still works when browser storage is unavailable.
  }
}

function element(tag, text, className) {
  const node = document.createElement(tag);

  if (text !== undefined && text !== null) {
    node.textContent = text;
  }

  if (className) {
    node.className = className;
  }

  return node;
}

function button(text, action) {
  const node = element("button", text);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}

function loadImage(file) {
  if (imageCache.has(file)) {
    return imageCache.get(file);
  }

  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      imageCache.delete(file);

      reject(
        new Error(
          `找不到 assets/${file}.jpg\n` +
          "請檢查圖片是否已上傳，以及檔名的大小寫。"
        )
      );
    };

    image.src = `./assets/${file}.jpg`;
  });

  imageCache.set(file, promise);
  return promise;
}

function cropImage(image, rectangle) {
  const [left, top, right, bottom] = rectangle;

  const x = Math.round(left * image.naturalWidth);
  const y = Math.round(top * image.naturalHeight);

  const width =
    Math.round(right * image.naturalWidth) - x;

  const height =
    Math.round(bottom * image.naturalHeight) - y;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  canvas.getContext("2d").drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
  );

  return canvas.toDataURL("image/png");
}

function picture(source, description) {
  const image = element("img");
  image.src = source;
  image.alt = description;
  return image;
}

async function showPanel(scene, panelNumber, version) {
  const image = await loadImage(scene.file);

  if (version !== renderVersion) {
    return;
  }

  const source = cropImage(image, PANELS[panelNumber]);
  const container = element("div", null, "panel");

  container.append(
    picture(
      source,
      `${scene.title}：第 ${panelNumber + 1} 格`
    ),
    button("放大漫畫", () => {
      const dialog = $("zoom");
      const enlargedImage = dialog.querySelector("img");

      enlargedImage.src = source;
      enlargedImage.alt =
        `${scene.title}：第 ${panelNumber + 1} 格`;

      dialog.showModal();
    })
  );

  screen.append(container);
}

/*
 * Response builder
 * Feedback appears automatically after all three selections.
 * Feedback is based on the predefined dropdown options.
 */
function showResponseBuilder(scene) {
  const container = element("div", null, "box");

  container.append(
    element("h3", "組合你的回應"),
    element(
      "p",
      "不用一次說得完美。選好三個部分後，下面會自動出現鼓勵和調整建議。"
    )
  );

  const selects = [];
  const labels = [
    "發生的事",
    "我的感受",
    "我的希望／界線"
  ];

  const storedValues = Array.isArray(state.builds[state.i])
    ? state.builds[state.i]
    : [];

  const preview = element("p");
  const feedback = element("div", null, "box");

  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  feedback.setAttribute("aria-atomic", "true");

  let lastReviewedValues = null;

  labels.forEach((labelText, index) => {
    const label = element("label", labelText);
    const select = element("select");

    select.id = `response-part-${index}`;
    label.htmlFor = select.id;

    select.append(new Option("請選擇……", ""));

    scene.parts[index].forEach(text => {
      select.append(new Option(text, text));
    });

    select.value = scene.parts[index].includes(
      storedValues[index]
    )
      ? storedValues[index]
      : "";

    selects.push(select);
    container.append(label, select);
  });

  function currentValues() {
    return selects.map(select => select.value);
  }

  function isComplete() {
    return selects.every(select => select.value !== "");
  }

  function updatePreview() {
    const values = currentValues();

    state.builds[state.i] = values;
    save();

    const selectedParts = values.filter(Boolean);

    preview.textContent = selectedParts.length
      ? selectedParts.join("，")
      : "你的句子會顯示在這裡。";
  }

  function addFeedbackParagraph(text) {
    feedback.append(element("p", text));
  }

  function reviewResponse(manual = false) {
    updatePreview();
    feedback.replaceChildren();

    if (!isComplete()) {
      addFeedbackParagraph(
        "不用急，先選好三個部分。完成後，我們再一起看看你的說法。"
      );

      if (manual) {
        selects.find(select => !select.value)?.focus();
      }

      return;
    }

    const values = currentValues();

    const indices = values.map(
      (value, index) =>
        scene.parts[index].indexOf(value)
    );

    const needsImprovement = [
      indices[0] === 1,
      indices[1] === 1,
      state.i === 0 && indices[2] === 1
    ];

    const firstImprovement =
      needsImprovement.indexOf(true);

    const hasChanged =
      lastReviewedValues !== null &&
      lastReviewedValues.some(
        (value, index) => value !== values[index]
      );

    if (hasChanged) {
      const improvedPart = needsImprovement.findIndex(
        (needsWork, index) =>
          !needsWork &&
          lastReviewedValues[index] !== values[index]
      );

      if (improvedPart >= 0) {
        const revisionMessages = [
          "你把概括的責備換成了具體發生的事，讓對方更容易知道你想談甚麼。",
          "你把評論對方的話換成了自己的感受，更清楚表達了你的心情。",
          "你提出了一個更具體的希望，讓對方知道可以怎樣回應。"
        ];

        addFeedbackParagraph(
          revisionMessages[improvedPart]
        );
      } else {
        addFeedbackParagraph(
          "你願意回頭想一想，再調整自己的說法，這就是練習的一部分。"
        );
      }
    }

    if (firstImprovement === -1) {
      feedback.append(
        element(
          "h4",
          state.i === 1
            ? "你的界線值得尊重"
            : "你已經把需要說清楚了"
        )
      );

      if (state.i === 1) {
        addFeedbackParagraph(
          "你說出了不舒服，也提出了界線。這句話已經可以使用，不一定需要說得更溫柔。"
        );

        addFeedbackParagraph(
          "如果對方不停止，可以先離開並尋求支援。你不需要先說得完美，才有權保護自己。"
        );
      } else {
        addFeedbackParagraph(
          "你描述了發生的事、自己的感受和一個具體希望。這些部分可以保留。"
        );

        addFeedbackParagraph(
          "再想想：這句話像你平常會說的話嗎？你可以調整字眼，讓它更自然。"
        );

        addFeedbackParagraph(
          "對方未必立即理解，但你的感受仍值得被聽見。"
        );
      }
    } else {
      feedback.append(
        element("h4", "先保留你的心情，再調整一小部分")
      );

      addFeedbackParagraph(
        "你願意把心裡的話說出來，這值得肯定。不用整句重來，我們先改一部分就可以。"
      );

      const suggestions = [
        `「${values[0]}」比較像概括的責備。可以改成一次具體發生的事，例如「${scene.parts[0][0]}」。`,
        `「${values[1]}」是在評論或猜測對方，還沒有說出你的心情。可以試試「${scene.parts[1][0]}」。`,
        `「${values[2]}」可能沒有說出你真正希望對方怎樣做。可以提出具體請求，例如「${scene.parts[2][0]}」。`
      ];

      addFeedbackParagraph(
        suggestions[firstImprovement]
      );

      if (!needsImprovement[0]) {
        addFeedbackParagraph(
          "你已經指出具體發生的事，這部分可以保留。"
        );
      }

      if (!needsImprovement[1]) {
        addFeedbackParagraph(
          "你已經說出了自己的感受，這部分可以保留。"
        );
      }

      if (state.i === 1) {
        addFeedbackParagraph(
          "這個措辭建議不是要求你討好對方。無論怎樣表達，你都有權拒絕不舒服的接觸。"
        );
      }
    }

    const actions = element("div", null, "chips");

    actions.append(
      button("修改我的說法", () => {
        const target =
          firstImprovement >= 0
            ? firstImprovement
            : 0;

        selects[target].focus();
      })
    );

    const demonstration = element("div", null, "box");
    demonstration.hidden = true;

    demonstration.append(
      element("h4", "一個可以參考的說法"),
      element(
        "p",
        scene.parts.map(options => options[0]).join("，")
      ),
      element(
        "small",
        "這只是一個示範，不會取代你選好的句子。你也可以用自己的說話方式表達。"
      )
    );

    const exampleButton = button(
      "看看一個示範",
      () => {
        demonstration.hidden =
          !demonstration.hidden;

        exampleButton.textContent =
          demonstration.hidden
            ? "看看一個示範"
            : "收起示範";
      }
    );

    actions.append(
      exampleButton,
      button("我準備好繼續了", () => {
        $("next").click();
      })
    );

    feedback.append(actions, demonstration);
    lastReviewedValues = [...values];
  }

  selects.forEach(select => {
    select.addEventListener("change", () => {
      updatePreview();

      // Automatically display feedback when all parts are selected.
      reviewResponse(false);
    });
  });

  container.append(
    element("h4", "你的句子"),
    preview,
    button("看看我的說法", () => {
      reviewResponse(true);
    }),
    feedback
  );

  screen.append(container);

  // Restore the preview and feedback when revisiting this
