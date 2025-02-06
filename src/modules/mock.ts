import { Lang } from "./types.ts";

export const Langs_Mock: Lang[] = [
    {
        id: 1,
        name: "Python",
        shortDescription: "Объединяет простоту и мощь",
        description: "— это высокоуровневый язык программирования общего назначения, который широко используется благодаря своей гибкости, простоте и мощным возможностям расширения. Вот основные технические характеристики Python:",
        imgLink: "http://localhost:9000/code-inspector/python.png",
        author: "Гвидо ван Россум",
        year: "1991",
        version: "Python 3.12.6 (Sep 12, 2024)",
        list: {
            Исполняемость: "Python интерпретируемый язык. Код выполняется интерпретатором, который читает и исполняет команды строка за строкой.",
            "Модульность и библиотеки": "Python поддерживает создание модулей и пакетов, а также имеет обширную стандартную библиотеку с множеством функциональных возможностей.",
            Мультисистемность: "Python доступен для большинства операционных систем, включая Windows, macOS и Linux.",
            "Объектно-Ориентированное Программирование (ООП)": "Python поддерживает ООП, позволяя создавать классы и объекты.",
            "Пакетный менеджер": "Python использует pip в качестве стандартного инструмента для установки и управления пакетами и библиотеками.",
            Производительность: "Python может быть медленнее по сравнению с компилируемыми языками, но его производительность можно улучшить с помощью различных оптимизаций, таких как Cython и PyPy.",
            Синтаксис: "Python имеет простой и читаемый синтаксис, что делает его удобным для новичков. Отступы используются для обозначения блоков кода.",
            Типизация: "Python является динамически типизированным языком, что означает, что типы переменных проверяются во время выполнения программы.",
        },
        status: true,
    },
    {
        id: 2,
        name: "C++",
        shortDescription: "Контроль и производительность в одном лице",
        description: "— это мощный и высокопроизводительный язык программирования, известный своей способностью обеспечивать низкоуровневый доступ к памяти и поддерживать сложные структуры данных. Вот основные технические характеристики C++:",
        author: "Бьёрн Страуструп",
        year: "1985",
        version: "C++20 (Dec 2020)",
        list: {
            Производительность: "C++ обеспечивает высокую производительность за счет компиляции в машинный код и эффективного управления ресурсами.",
            Синтаксис: "C++ поддерживает широкий спектр программных конструкций, включая функции, классы, шаблоны и перегрузку операторов, что делает его подходящим для различных типов программирования.",
            "Объектно-Ориентированное Программирование (ООП)": "C++ позволяет создавать и использовать классы и объекты, поддерживает наследование, полиморфизм и инкапсуляцию.",
            Шаблоны: "C++ поддерживает шаблоны для создания обобщенного кода, который может работать с различными типами данных.",
            Мультисистемность: "C++ доступен для множества операционных систем и платформ, что позволяет создавать кроссплатформенные приложения.",
            "Стандартная библиотека": "C++ включает стандартную библиотеку, которая предоставляет функции и классы для работы с коллекциями, вводом/выводом, и алгоритмами.",
            "Управление памятью": "C++ позволяет явное управление памятью с помощью указателей и динамического выделения, что требует от программиста внимательного контроля ресурсов.",
            "Проектирование и сборка": "C++ проектирование и сборка поддерживаются различными системами сборки и управления зависимостями, такими как CMake и Make.",
        },
        status: true,
    },
    // Аналогично для остальных языков
];
