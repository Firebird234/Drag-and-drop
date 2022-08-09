import { useEffect } from "react";
import { useState } from "react";
import "./Admin.css";

export function Admin() {
  const [cardList, setCardList] = useState([
    {
      id: 11,
      title: "Список задач",
      order: 1,
      items: [
        { id: 1, title: "ПокушоЦЦ", order: 1 },
        { id: 2, title: "Погладить котика", order: 2 },
        { id: 3, title: "Поработать Немношк", order: 3 },
      ],
    },
    {
      id: 12,
      title: "В процессе",
      order: 2,
      items: [
        { id: 4, title: "Ввести новые товары", order: 1 },
        { id: 5, title: "Погладить котика", order: 2 },
      ],
    },
    {
      id: 13,
      title: "Сделано",
      order: 3,
      items: [
        { id: 6, title: "Составить отчет", order: 1 },
        { id: 7, title: "Погладить котика", order: 2 },
        { id: 8, title: "Добыть еще котиков", order: 3 },
      ],
    },
  ]);

  const [currentCard, setCurrentCard] = useState({});
  const [currentItem, setCurrentItem] = useState({});

  const [popup, setPopup] = useState(false);

  function dragStartHandler(e, card, item) {
    // console.log(card, item);
    setCurrentCard(card);
    setCurrentItem(item);
  }

  function dragEndHandler(e) {}

  function dragLeaveHandler(e) {}

  function dragOverHandler(e) {
    e.preventDefault();
  }

  function dropItemHandler(e, card, item) {
    e.preventDefault();
    e.stopPropagation();
    const currentIndex = currentCard.items.indexOf(currentItem);
    // setCurrentCard(currentCard.items.splice(currentIndex, 1));
    currentCard.items.splice(currentIndex, 1);
    const dropIndex = card.items.indexOf(item);
    console.log(currentIndex, dropIndex);
    if (card.id === currentCard.id) {
      currentIndex === 0 && card.items.splice(dropIndex + 1, 0, currentItem);
      currentIndex > 0 && card.items.splice(dropIndex, 0, currentItem);
    } else {
      card.items.splice(dropIndex, 0, currentItem);
    }

    setCardList(
      cardList.map((el) => {
        if (el.id === card.id) {
          return card;
        }
        if (el.id === currentCard.id) {
          return currentCard;
        }
        return el;
      }),
    );
  }

  function dropCardHandler(e, card) {
    card.items.push(currentItem);
    const currentIndex = currentCard.items.indexOf(currentItem);
    // setCurrentCard(currentCard.items.splice(currentIndex, 1));
    currentCard.items.splice(currentIndex, 1);
    setCardList(
      cardList.map((el) => {
        if (el.id === card.id) {
          return card;
        }
        if (el.id === currentCard.id) {
          return currentCard;
        }
        return el;
      }),
    );
  }

  function dropHandler(e, card, item) {
    console.log(item);
    if (!item) {
      console.log("no items");
      dropCardHandler(e, card);
    } else {
      dropItemHandler(e, card, item);
      console.log("item");
    }
  }

  function handleAddTask() {
    setPopup(true);
  }

  return (
    <div className={`admin-page ${popup && "admin-page_dark"}`}>
      {popup && (
        <form className="admin-page__popup">
          <label>
            <span className="admin-page__label">Добавить Задачу</span>
            <input className="admin-page__task" type="text" />
          </label>
          <button className="admin-page__submint" type="click">
            Добавить
          </button>
        </form>
      )}
      {cardList.map((card) => {
        return (
          <div
            key={card.id}
            className="admin-page__card"
            onDragOver={(e) => {
              dragOverHandler(e);
            }}
            onDrop={(e) => {
              dropHandler(e, card, false);
            }}
          >
            <button type="button" className={`admin-page__addTask_${card.id}`}>
              Добавить таску
            </button>
            <span style={{ fontSize: "18px", fontWeight: 800 }}>{card.title}</span>
            {card.items.map((item) => {
              return (
                <div
                  draggable={true}
                  key={item.id}
                  onDragStart={(e) => {
                    dragStartHandler(e, card, item);
                  }}
                  onDragEnd={(e) => {
                    dragEndHandler(e);
                  }}
                  onDragOver={(e) => {
                    dragOverHandler(e);
                  }}
                  onDragLeave={(e) => {
                    dragLeaveHandler(e);
                  }}
                  onDrop={(e) => {
                    dropHandler(e, card, item);
                  }}
                  className="admin-page__item"
                >
                  <span>{item.order + ". " + item.title}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
