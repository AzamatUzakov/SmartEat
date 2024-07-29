function calculateBJU() {
    const пол = document.querySelector('input[name="gender"]:checked').value;
    const высота = parseFloat(document.getElementById('height').value);
    const вес = parseFloat(document.getElementById('weight').value);
    const возраст = parseFloat(document.getElementById('age').value);
    const цель = document.getElementById('goal').value;
    const тренировкиВНеделю = parseInt(document.getElementById('workoutsPerWeek').value);
    const уровеньАктивности = document.getElementById('activityLevel').value;

    let мужскойУм = document.querySelector('#male_hum');
    let level_p = document.querySelector('.level_p');
    let workout_p = document.querySelector('.workout_p');
    let target_p = document.querySelector('.target_p');
    let height_hum = document.querySelector('#height_hum');
    let weight_hum = document.querySelector('#weight_hum');
    let age_num = document.querySelector('#age_hum');

    let bmr;
    if (пол === 'male') {
        bmr = (10 * вес) + (6.25 * высота) - (5 * возраст) + 5;
        мужскойУм.innerHTML = "<b>М</b><br> Пол";
    } else {
        bmr = (10 * вес) + (6.25 * высота) - (5 * возраст) - 161;
        мужскойУм.innerHTML = "<b>Ж</b><br> Пол";
    }

    let activityFactor;
    switch (уровеньАктивности) {
        case 'low':
            activityFactor = 1.2;
            level_p.innerHTML = "<b>Сидячая работа, малоподвижный образ жизни</b>";
            break;
        case 'medium':
            activityFactor = 1.55;
            level_p.innerHTML = "<b>Сидячая работа, среднеактивный образ жизни</b>";
            break;
        case 'high':
            activityFactor = 1.9;
            level_p.innerHTML = "<b>Работа связана с физической нагрузкой, очень активный образ жизни</b>";
            break;
    }

    if (тренировкиВНеделю >= 5) {
        activityFactor += 0.2;
    } else if (тренировкиВНеделю >= 3) {
        activityFactor += 0.1;
    }
    workout_p.innerHTML = `<b>${тренировкиВНеделю} тренировки в неделю</b>`;

    const tdee = bmr * activityFactor;

    let targetCalories;
    switch (цель) {
        case 'maintain':
            targetCalories = tdee;
            target_p.innerHTML = "<b>Поддерживать свою форму</b>";
            break;
        case 'lose':
            targetCalories = tdee - 500;
            target_p.innerHTML = "<b>Похудеть (убрать жир)</b>";
            break;
        case 'gain':
            targetCalories = tdee + 500;
            target_p.innerHTML = "<b>Набрать мышечную массу</b>";
            break;
    }

    height_hum.innerHTML = `<b>${высота} см</b><br>Рост`;
    weight_hum.innerHTML = `<b>${вес} кг</b><br>Вес`;
    age_num.innerHTML = `<b>${возраст}</b><br>Возраст`;

    const targetProteinGrams = (targetCalories * 0.3) / 4;
    const targetFatGrams = (targetCalories * 0.25) / 9;
    const targetCarbGrams = (targetCalories * 0.45) / 4;

    document.getElementById('proteins').innerHTML = `<b>${targetProteinGrams.toFixed(0)}</b> <br> Белки`;
    document.getElementById('fats').innerHTML = `<b>${targetFatGrams.toFixed(0)}</b> <br> Жиры`;
    document.getElementById('carbs').innerHTML = `<b>${targetCarbGrams.toFixed(0)}</b> <br> Углеводы`;
    document.getElementById('calories').innerHTML = `<b>${targetCalories.toFixed(0)}</b> <br> ккал`;

    document.getElementById('editProteins').value = targetProteinGrams.toFixed(0);
    document.getElementById('editFats').value = targetFatGrams.toFixed(0);
    document.getElementById('editCarbs').value = targetCarbGrams.toFixed(0);
    document.getElementById('editCalories').value = targetCalories.toFixed(0);

    document.getElementById('editProteinPercentage').value = 30;
    document.getElementById('editFatPercentage').value = 25;
    document.getElementById('editCarbPercentage').value = 45;
}

function showEditForm() {
    document.getElementById('editForm').style.display = 'block';
}

function updateMacrosBasedOnPercentages() {
    const editCalories = parseFloat(document.getElementById('editCalories').value);
    const editProteinPercentage = parseFloat(document.getElementById('editProteinPercentage').value) / 100;
    const editFatPercentage = parseFloat(document.getElementById('editFatPercentage').value) / 100;
    const editCarbPercentage = parseFloat(document.getElementById('editCarbPercentage').value) / 100;

    if (Math.abs(editProteinPercentage + editFatPercentage + editCarbPercentage - 1) > 0.01) {
        alert('Сумма процентов должна быть равна 100%');
        return;
    }

    const newProteinGrams = (editCalories * editProteinPercentage) / 4;
    const newFatGrams = (editCalories * editFatPercentage) / 9;
    const newCarbGrams = (editCalories * editCarbPercentage) / 4;

    document.getElementById('editProteins').value = newProteinGrams.toFixed(0);
    document.getElementById('editFats').value = newFatGrams.toFixed(0);
    document.getElementById('editCarbs').value = newCarbGrams.toFixed(0);
}

function saveEditedBJU() {
    const editProteins = parseFloat(document.getElementById('editProteins').value);
    const editFats = parseFloat(document.getElementById('editFats').value);
    const editCarbs = parseFloat(document.getElementById('editCarbs').value);
    const editCalories = parseFloat(document.getElementById('editCalories').value);

    const editProteinPercentage = parseFloat(document.getElementById('editProteinPercentage').value) / 100;
    const editFatPercentage = parseFloat(document.getElementById('editFatPercentage').value) / 100;
    const editCarbPercentage = parseFloat(document.getElementById('editCarbPercentage').value) / 100;

    if (Math.abs(editProteinPercentage + editFatPercentage + editCarbPercentage - 1) > 0.01) {
        alert('Сумма процентов должна быть равна 100%');
        return;
    }

    const totalCalories = (editProteins * 4) + (editFats * 9) + (editCarbs * 4);

    document.getElementById('proteins').innerHTML = `<b>${editProteins.toFixed(0)}</b> <br> Белки`;
    document.getElementById('fats').innerHTML = `<b>${editFats.toFixed(0)}</b> <br> Жиры`;
    document.getElementById('carbs').innerHTML = `<b>${editCarbs.toFixed(0)}</b> <br> Углеводы`;
    document.getElementById('calories').innerHTML = `<b>${totalCalories.toFixed(0)}</b> <br> ккал`;

    document.getElementById('editForm').style.display = 'none';
}

// Добавьте обработчики событий для ввода процентов
document.getElementById('editProteinPercentage').addEventListener('input', updateMacrosBasedOnPercentages);
document.getElementById('editFatPercentage').addEventListener('input', updateMacrosBasedOnPercentages);
document.getElementById('editCarbPercentage').addEventListener('input', updateMacrosBasedOnPercentages);

// Добавьте обработчик события для сохранения изменений
document.getElementById('saveEditedBJU').addEventListener('click', saveEditedBJU);
