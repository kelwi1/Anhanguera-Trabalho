// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

const pages = [...document.querySelectorAll('.page')];
const navLinks = [...document.querySelectorAll('.nav-link')];

let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date();

let booking = null;
let userName = 'Visitante';
let userEmail = '';


// ========================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ========================================

function showPage(id) {

    const target =
        document.getElementById(id) ||
        document.getElementById('inicio');

    pages.forEach(page => {
        page.classList.toggle('active', page === target);
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.dataset.page === target.id
        );
    });

    document
        .getElementById('mainNav')
        .classList.remove('open');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


// ========================================
// EVENTOS DE NAVEGAÇÃO
// ========================================

document.querySelectorAll('[data-go]').forEach(button => {

    button.addEventListener('click', () => {
        showPage(button.dataset.go);
    });

});

navLinks.forEach(link => {

    link.addEventListener('click', event => {

        event.preventDefault();

        showPage(link.dataset.page);

    });

});


// ========================================
// MENU MOBILE
// ========================================

document
    .getElementById('menuToggle')
    .addEventListener('click', () => {

        document
            .getElementById('mainNav')
            .classList.toggle('open');

    });


// ========================================
// ANO AUTOMÁTICO NO RODAPÉ
// ========================================

document.getElementById('year').textContent =
    new Date().getFullYear();


// ========================================
// NOTIFICAÇÕES
// ========================================

function toast(msg) {

    const element = document.getElementById('toast');

    element.textContent = msg;

    element.classList.add('show');

    setTimeout(() => {

        element.classList.remove('show');

    }, 2600);

}


// ========================================
// SELEÇÃO DE SERVIÇOS
// ========================================

document.querySelectorAll('.service-card').forEach(card => {

    card.addEventListener('click', () => {

        document.getElementById('serviceSelect').value =
            card.dataset.service;

        document.querySelectorAll('.service-card').forEach(item => {

            item.classList.remove('selected');

        });

        card.classList.add('selected');

        showPage('agendamento');

    });

});


// ========================================
// CALENDÁRIO DE AGENDAMENTO
// ========================================

function renderCalendar() {

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    document.getElementById('monthLabel').textContent =
        new Intl.DateTimeFormat('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).format(currentMonth);

    const calendar = document.getElementById('calendar');

    calendar.innerHTML = '';

    // Dias da semana

    ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach(day => {

        const element = document.createElement('span');

        element.textContent = day;

        calendar.append(element);

    });

    // Primeiro dia do mês

    const firstDay = new Date(year, month, 1).getDay();

    // Quantidade de dias do mês

    const totalDays = new Date(year, month + 1, 0).getDate();

    // Data atual

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    // Espaços antes do primeiro dia

    for (let i = 0; i < firstDay; i++) {

        const blank = document.createElement('span');

        calendar.append(blank);

    }

    // Criar os dias do calendário

    for (let day = 1; day <= totalDays; day++) {

        const date = new Date(year, month, day);

        const button = document.createElement('button');

        button.textContent = day;

        // Desabilitar dias passados e domingos

        button.disabled =
            date < today || date.getDay() === 0;

        // Destacar data selecionada

        if (
            selectedDate &&
            date.toDateString() === selectedDate.toDateString()
        ) {

            button.classList.add('chosen');

        }

        // Evento de seleção da data

        button.addEventListener('click', () => {

            selectedDate = date;

            selectedTime = null;

            renderCalendar();

            renderTimes();

            document.getElementById('bookingHint').textContent =
                'Agora escolha um horário disponível.';

        });

        calendar.append(button);

    }

}


// ========================================
// SELEÇÃO DE HORÁRIOS
// ========================================

function renderTimes() {

    document.querySelectorAll('#timeSlots button').forEach(button => {

        button.classList.toggle(
            'selected',
            button.textContent === selectedTime
        );

        button.onclick = () => {

            selectedTime = button.textContent;

            renderTimes();

        };

    });

}


// ========================================
// NAVEGAÇÃO DO CALENDÁRIO
// ========================================

// Mês anterior

document.getElementById('prevMonth').onclick = () => {

    currentMonth.setMonth(currentMonth.getMonth() - 1);

    renderCalendar();

};


// Próximo mês

document.getElementById('nextMonth').onclick = () => {

    currentMonth.setMonth(currentMonth.getMonth() + 1);

    renderCalendar();

};


// Inicializar calendário e horários

renderCalendar();

renderTimes();


// ========================================
// CONFIRMAR AGENDAMENTO
// ========================================

document
    .getElementById('confirmBooking')
    .addEventListener('click', () => {

        // Verificar seleção

        if (!selectedDate || !selectedTime) {

            toast('Selecione uma data e um horário.');

            return;

        }

        // Guardar informações do agendamento

        booking = {

            service: document.getElementById('serviceSelect').value,

            date: selectedDate,

            time: selectedTime

        };

        // Formatar data

        const dateText = selectedDate.toLocaleDateString(
            'pt-BR',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }
        );

        // Mostrar resumo do agendamento

        document.getElementById('bookingSummary').innerHTML = `
            <b>▦ Data</b><br>
            ${dateText}<br>

            <b>◷ Horário</b><br>
            ${selectedTime}<br>

            <b>🔧 Serviço</b><br>
            ${booking.service}
        `;

        // Atualizar acompanhamento

        document.getElementById('trackDate').textContent =
            `${dateText} às ${selectedTime}`;

        // Abrir confirmação

        showPage('confirmacao');

    });


// ========================================
// LOGIN DO USUÁRIO
// ========================================

document
    .getElementById('loginForm')
    .addEventListener('submit', event => {

        event.preventDefault();

        userEmail =
            document.getElementById('loginEmail').value;

        userName = userEmail
            .split('@')[0]
            .replace(/[._-]/g, ' ')
            .replace(/\b\w/g, character =>
                character.toUpperCase()
            );

        // Atualizar perfil

        document.getElementById('profileName').textContent =
            userName;

        document.getElementById('profileEmail').textContent =
            userEmail;

        toast('Login demonstrativo realizado!');

        showPage('perfil');

    });


// ========================================
// CADASTRO DE USUÁRIO
// ========================================

document
    .getElementById('registerLink')
    .addEventListener('click', event => {

        event.preventDefault();

        toast('Cadastro estará disponível em uma próxima versão.');

    });


// ========================================
// SAIR DA CONTA
// ========================================

document
    .getElementById('logoutBtn')
    .addEventListener('click', () => {

        userName = 'Visitante';

        userEmail = '';

        // Restaurar informações do perfil

        document.getElementById('profileName').textContent =
            userName;

        document.getElementById('profileEmail').textContent =
            'Entre para acessar seus dados';

        showPage('inicio');

        toast('Você saiu da demonstração.');

    });