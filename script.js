let categoryId, sortCategory = false;
const tabContainer = document.getElementById("button-container");
const cardContainer = document.getElementById("card-container");
const sortButton = document.getElementById("sort-button");
const initializeApp = async () => {
    try {
        const categories = await fetchCategories();
        if (categories.length > 0) {
            categoryId = categories[0].category_id;
            populateCategoryTabs(categories);
            handleCard();
        } else {
            showNoContentMessage();
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};
const fetchCategories = async () => {
    const response = await fetch("https://openapi.programming-hero.com/api/videos/categories");
    const json = await response.json();
    return json.data;
};
const populateCategoryTabs = (categories) => {
    tabContainer.innerHTML = "";
    categories.forEach((category) => {
        const tab = document.createElement("button");
        tab.className = "btn btn-xs sm:btn-sm md:btn-md lg:btn-md hover:bg-red-500 hover:text-white px-4 py-2 rounded-md mr-2 mb-2 hover:bg-blue-600 focus:outline-none";
        tab.textContent = category.category;
        tab.addEventListener("click", () => changeCategory(category.category_id));
        tabContainer.appendChild(tab);
    });
};
const changeCategory = (id) => {
    categoryId = id;
    sortCategory = false;
    updateSortButton();
    handleCard();
};
const updateSortButton = () => {
    const buttonText = sortCategory ? "Sort by default" : "Sort by view";
    const buttonClassList = sortButton.classList;
    buttonClassList.toggle('bg-gradient-to-b', sortCategory);
    buttonClassList.toggle('from-[#FF1F3D]', sortCategory);
    buttonClassList.toggle('to-[#FF1F3D]', sortCategory);
    buttonClassList.toggle('text-white', sortCategory);
    buttonClassList.toggle('text-xs', sortCategory);
    sortButton.innerText = buttonText;
};
const handleCard = async () => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
        const json = await response.json();
        const data = json.data;

        let cards = [...data];
        if (sortCategory) {
            cards.sort((a, b) => parseFloat(b.others.views) - parseFloat(a.others.views));
        }

        populateCardContainer(cards);
    } catch (error) {
        console.error("Error fetching video data:", error);
    }
};
const populateCardContainer = (cards) => {
    cardContainer.innerHTML = "";

    if (cards.length === 0) {
        showNoContentMessage();
    } else {
        cardContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-8', 'mb-8');

        cards.forEach((cardInfo) => {
            const cardDiv = createCardElement(cardInfo);
            cardContainer.appendChild(cardDiv);
        });
    }
};
const createCardElement = (cardInfo) => {
    const div = document.createElement('div');
    div.className = 'card bg-base-100';
    div.innerHTML = `
        <figure>
            <img class="w-full h-[200px] rounded-b-xl" src="${cardInfo.thumbnail}" alt="" />
        </figure>
        <div class="flex items-start gap-4 mt-5 relative">
            <div>
                <img class="w-[40px] h-[32px] rounded-full" src="${cardInfo.authors[0].profile_picture}" alt="">
            </div>
            <div class="w-64">
                <h2 class="text-lg font-bold">${cardInfo.title}</h2>
                <div class="flex gap-2 items-center mt-3">
                    <p class="font-medium">${cardInfo.authors[0].profile_name}</p>
                    ${cardInfo.authors[0].verified ? `<img src="86-PHero-tube/img/blue-mark.svg">` : ''}
                </div>
                <p>${cardInfo.others.views} views</p>
            </div>
            <div class="absolute right-4 -top-16">
                ${convertSecondsToHoursAndMinutes(cardInfo.others.posted_date) !== '0 hrs 0 min ago' ?
            `<p class="bg-[#171717] text-white px-2 py-1 rounded-md">${convertSecondsToHoursAndMinutes(cardInfo.others.posted_date)}</p>` : ''}
            </div>
        </div>
    `;
    return div;
};
const showNoContentMessage = () => {
    updateSortButton();
    cardContainer.className = '';
    cardContainer.innerHTML = `
        <div class="flex justify-center items-center w-full my-24 md:my-56">
            <div class="flex flex-col justify-center items-center text-center">
                <img src="86-PHero-tube/img/Icon.png" alt="">
                <h3 class="text-xl md:text-4xl font-bold md:w-[400px] mt-8">Oops!! Sorry, There is no content here</h3>
            </div>
        </div>
    `;
};
const convertSecondsToHoursAndMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hrs ${minutes} min ago`;
};
sortButton.addEventListener("click", () => {
    sortCategory = !sortCategory;
    updateSortButton();
    handleCard();
});
initializeApp();

