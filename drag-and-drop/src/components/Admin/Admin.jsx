import { useEffect } from "react";
import { useState } from "react";
import useFormValidaion from "../../hooks/Validation/Validation";
import "./Admin.css";

export function Admin() {
   const [cardList, setCardList] = useState([
      {
         id: 11,
         title: "Список задач",
         order: 1,
         items: [
            { id: "a", title: "ПокушоЦЦ", order: 1 },
            { id: "b", title: "Погладить котика", order: 2 },
            { id: "c", title: "Поработать Немношк", order: 3 },
         ],
      },
      {
         id: 12,
         title: "В процессе",
         order: 2,
         items: [
            { id: "d", title: "Ввести новые товары", order: 1 },
            { id: "e", title: "Погладить котика", order: 2 },
         ],
      },
      {
         id: 13,
         title: "Сделано",
         order: 3,
         items: [
            { id: "f", title: "Составить отчет", order: 1 },
            { id: "g", title: "Погладить котика", order: 2 },
            { id: "h", title: "Добыть еще котиков", order: 3 },
         ],
      },
   ]);

   const { resetForm, values, errors, isValid, handleChange, setValues } = useFormValidaion();

   const [currentCard, setCurrentCard] = useState({});
   const [currentItem, setCurrentItem] = useState({});

   const [popup, setPopup] = useState(false);
   const [editCardId, setEditCardId] = useState(0);
   const [hoveredItemId, setHoveredItemId] = useState("");

   function dragStartHandler(e, card, item) {
      setCurrentCard(card);
      setCurrentItem(item);
   }

   function dragEndHandler(e) {}

   function dragLeaveHandler(e) {
      setHoveredItemId("");
   }

   function dragOverHandler(e, card) {
      e.preventDefault();
      e.stopPropagation();
   }

   function dropItemHandler(e, card, item) {
      e.preventDefault();
      e.stopPropagation();
      const currentIndex = currentCard.items.indexOf(currentItem);
      // setCurrentCard(currentCard.items.splice(currentIndex, 1));
      currentCard.items.splice(currentIndex, 1);
      const dropIndex = card.items.indexOf(item);
      if (card.id === currentCard.id) {
         if (currentIndex === 0) {
            card.items.splice(dropIndex + 1, 0, currentItem);
         } else if (currentIndex > dropIndex) {
            console.log("smaller", currentIndex, dropIndex);
            currentIndex > 0 && card.items.splice(dropIndex, 0, currentItem);
         } else {
            console.log("bigger");
            currentIndex > 0 && card.items.splice(dropIndex + 1, 0, currentItem);
         }
      } else {
         card.items.splice(dropIndex, 0, currentItem);
      }
      setHoveredItemId("");

      setCardList(
         cardList.map((el) => {
            if (el.id === card.id) {
               return card;
            }
            if (el.id === currentCard.id) {
               return currentCard;
            }
            return el;
         })
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
         })
      );
   }

   function dropHandler(e, card, item) {
      if (!item) {
         dropCardHandler(e, card);
      } else {
         dropItemHandler(e, card, item);
      }
   }

   function handleCreateTask(cardId) {
      setPopup(true);
      setEditCardId(cardId);
   }

   function handleAddTask(e) {
      e.preventDefault();
      const cardToAdd = cardList.find((el) => el.id === editCardId);
      console.log(cardToAdd.items[cardToAdd.items.length - 1]);
      cardToAdd.items.push({ id: cardToAdd.items.length + 1, title: values.Task, order: cardToAdd.items.length + 1 });
      setPopup(false);
   }

   useEffect(() => {
      const localSt = JSON.parse(localStorage.getItem("Tasks"));
      console.log(localSt);
      setCardList(localSt);
   }, []);

   useEffect(() => {
      const localSt = JSON.parse(localStorage.getItem("Tasks"));
      console.log(localSt);
      localStorage.setItem("Tasks", JSON.stringify(cardList));
   }, [cardList]);

   return (
      <div className={`admin-page ${popup && "admin-page_dark"}`}>
         {popup && (
            <form className="admin-page__popup">
               <label>
                  <span className="admin-page__label">Добавить Задачу</span>
                  <input className="admin-page__task" name="Task" type="text" onChange={handleChange} />
               </label>
               <button className="admin-page__submint" type="click" onClick={handleAddTask}>
                  Добавить
               </button>
            </form>
         )}
         {cardList.map((card) => {
            return (
               <div
                  key={card.id}
                  className={`admin-page__card`}
                  onDragOver={(e) => {
                     dragOverHandler(e, card);
                  }}
                  onDrop={(e) => {
                     dropHandler(e, card, false);
                  }}
               >
                  <button
                     type="button"
                     onClick={() => handleCreateTask(card.id)}
                     className={`admin-page__addTask_${card.id}`}
                  >
                     Добавить таску
                  </button>
                  <span>{card.title}</span>
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
                              setHoveredItemId(item.id);
                              dragOverHandler(e, card);
                           }}
                           onDragLeave={(e) => {
                              dragLeaveHandler(e);
                           }}
                           onDrop={(e) => {
                              dropHandler(e, card, item);
                           }}
                           className={`admin-page__item ${hoveredItemId === item.id && "padding"}`}
                        >
                           <div className={`admin-page__itemContainer ${hoveredItemId === item.id && "orange"}`}>
                              {card.items.indexOf(item) + 1 + ". " + item.title}
                           </div>
                        </div>
                     );
                  })}
               </div>
            );
         })}
      </div>
   );
}
