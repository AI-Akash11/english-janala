const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
    return htmlElements.join(" ")
}

const manageSpinner = (status) => {
    if(status == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden")
    }else{
        document.getElementById("word-container").classList.remove("hidden")
        document.getElementById("spinner").classList.add("hidden");
    }
}

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLesson(data.data))
}
const loadLessonWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        removeActive();
        const clickedBtn = document.getElementById(`lesson-btn-${id}`);
        clickedBtn.classList.add("active")
        displayLessonWord(data.data)
    })
}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(btn => btn.classList.remove("active"))
}

const loadWordDetail = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`

    fetch(url)
    .then(res => res.json())
    .then(data => displayWordDetail(data.data))
}

const displayWordDetail = (data) => {
    const detailsBox = document.getElementById("details-container")
    detailsBox.innerHTML = `
    <div class="space-y-5">
        <div>
            <h2 class="text-2xl font-bold">
            ${data.word} (<i class="fa-solid fa-microphone-lines"></i> : ${data.pronunciation})
            </h2>
        </div>
        <div>
          <h2 class="font-bold">
          Meaning
        </h2>
        <p>${data.meaning}</p>
        </div>
        <div>
          <h2 class="font-bold">Example</h2>
          <p>${data.sentence}</p>
        </div>
        <div>
          <h2 class="font-bold">synonames</h2>
          <div>
          ${createElements(data.synonyms)}
          </div>
        </div>
    </div>
    `
    document.getElementById("my_modal_5").showModal();
}

const displayLessonWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length == 0){
        wordContainer.innerHTML = `
        <div class="text-center col-span-full py-10 rounded-lg">
        <img class="mx-auto mb-5" src="./assets/alert-error.png"/>
        <p class="text-lg font-medium text-gray-400 mb-5 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।|</p>
        <h2 class="font-bold text-4xl font-bangla">নেক্সট Lesson এ যান।</h2>
      </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm text-center py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl">${word.word ? word.word: "শব্দ পাওয়া যায়নি"}</h2>
        <p class="font-semibold">meaning | Pronounciation</p>
        <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning: "অর্থ পাওয়া যায়নি"} | ${word.pronunciation ? word.pronunciation: "উচ্চারণ পাওয়া যায়নি"}"</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1a91ff20] hover:bg-[#1a91ff80]"><i class="fa-solid fa-circle-info"></i></button>
          <button class="btn bg-[#1a91ff20] hover:bg-[#1a91ff80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
        `
        wordContainer.append(card)
    });
    manageSpinner(false);
}

const displayLesson = (lessons) => {
    const lessonContainer = document.getElementById("lesson-container");
    lessonContainer.innerHTML = "";
    for(let lesson of lessons){
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML =`
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLessonWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i></i> Lesson - ${lesson.level_no}</button>
        `
        lessonContainer.append(btnDiv);
    }
}

loadLessons()