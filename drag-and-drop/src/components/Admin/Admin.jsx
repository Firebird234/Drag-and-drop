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

   function dragStartHandler(e, card, item) {
      // console.log(card, item);
      setCurrentCard(card);
      setCurrentItem(item);
   }

   function dragEndHandler(e) {
      // e.target.style.backgroundColor = 'white'
      e.target.style.backgroundColor = "white";
   }

   function dragLeaveHandler(e) {
      e.target.style.backgroundColor = "white";
      e.target.style.paddingTop = "0";
      // e.target.style.transform = 'translateY(0)';
   }

   function dragOverHandler(e, card) {
      e.preventDefault();
      e.stopPropagation();

      // const currentIndex = currentCard.items.indexOf(currentItem);
      // currentCard.items.splice(currentIndex, 1);
      // const dropIndex = card.items.indexOf(currentItem);
      // if (card.id === currentCard.id) {
      //   if (currentIndex === 0) {
      //     card.items.splice(dropIndex + 1, 0, currentItem);
      //   }
      //   else if (currentIndex > dropIndex) {
      //     console.log('smaller',currentIndex, dropIndex)
      //     currentIndex > 0 && card.items.splice(dropIndex, 0, currentItem);
      //   }
      //   else{
      //     console.log('bigger')
      //     currentIndex > 0 && card.items.splice(dropIndex + 1, 0, currentItem);
      //   }
      // } else {
      //   card.items.splice(dropIndex, 0, currentItem);
      // }
      // setCardList(
      //   cardList.map((el) => {
      //     if (el.id === card.id) {
      //       return card;
      //     }
      //     if (el.id === currentCard.id) {
      //       return currentCard;
      //     }
      //     return el;
      //   })
      // );
      // console.log(e.target.className === 'admin-page__item')
      if (e.target.className === "admin-page__item") {
         e.target.style.backgroundColor = "orange";
         e.target.style.paddingTop = "20px";

         // e.target.style.transform = 'translateY(20px)';
      }
      // if(e.target.className === 'admin-page__card') {
      //   e.target.style.backgroundColor = 'rgba(0,0,0,.8)'
      // }
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
      // e.target.style.transform = 'translateY(0)';
      e.target.style.backgroundColor = "white";
      e.target.style.paddingTop = "0";

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

   useEffect(() => console.log(values), [values]);

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
                  className="admin-page__card"
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
                              dragOverHandler(e, card);
                           }}
                           onDragLeave={(e) => {
                              dragLeaveHandler(e);
                           }}
                           onDrop={(e) => {
                              dropHandler(e, card, item);
                           }}
                           className="admin-page__item"
                        >
                           {card.items.indexOf(item) + 1 + ". " + item.title}
                        </div>
                     );
                  })}
               </div>
            );
         })}
      </div>
   );
}

// import { useEffect } from "react";
// import { useState } from "react";
// import useFormValidaion from "../../hooks/Validation/Validation";
// import "./Admin.css";

// export function Admin() {
//    const [cardList, setCardList] = useState([
//       {
//          id: 11,
//          title: "Список задач",
//          order: 1,
//          items: [
//             { id: "a", title: "ПокушоЦЦ", order: 1 },
//             { id: "b", title: "Погладить котика", order: 2 },
//             { id: "c", title: "Поработать Немношк", order: 3 },
//          ],
//       },
//       {
//          id: 12,
//          title: "В процессе",
//          order: 2,
//          items: [
//             { id: "d", title: "Ввести новые товары", order: 1 },
//             { id: "e", title: "Погладить котика", order: 2 },
//          ],
//       },
//       {
//          id: 13,
//          title: "Сделано",
//          order: 3,
//          items: [
//             { id: "f", title: "Составить отчет", order: 1 },
//             { id: "g", title: "Погладить котика", order: 2 },
//             { id: "h", title: "Добыть еще котиков", order: 3 },
//          ],
//       },
//    ]);

//    const { resetForm, values, errors, isValid, handleChange, setValues } = useFormValidaion();

//    const [currentCard, setCurrentCard] = useState({});
//    const [currentItem, setCurrentItem] = useState({});

//    const [popup, setPopup] = useState(false);

//    const [editCardId, setEditCardId] = useState(0);

//    function dragStartHandler(e, card, item) {
//       // console.log(card, item);
//       setCurrentCard(card);
//       setCurrentItem(item);
//    }

//    function dragEndHandler(e) {
//       // e.target.style.backgroundColor = 'white'
//       // e.target.style.backgroundColor = "white";
//    }

//    function dragLeaveHandler(e) {
//       // e.target.style.backgroundColor = "white";
//       e.target.style.paddingTop = "0";
//       setHoveredItemId("");
//       // e.target.style.transform = 'translateY(0)';
//    }

//    function dragOverHandler(e, card) {
//       e.preventDefault();
//       e.stopPropagation();
//       console.log(e.currentTarget);

//       // const currentIndex = currentCard.items.indexOf(currentItem);
//       // currentCard.items.splice(currentIndex, 1);
//       // const dropIndex = card.items.indexOf(currentItem);
//       // if (card.id === currentCard.id) {
//       //   if (currentIndex === 0) {
//       //     card.items.splice(dropIndex + 1, 0, currentItem);
//       //   }
//       //   else if (currentIndex > dropIndex) {
//       //     console.log('smaller',currentIndex, dropIndex)
//       //     currentIndex > 0 && card.items.splice(dropIndex, 0, currentItem);
//       //   }
//       //   else{
//       //     console.log('bigger')
//       //     currentIndex > 0 && card.items.splice(dropIndex + 1, 0, currentItem);
//       //   }
//       // } else {
//       //   card.items.splice(dropIndex, 0, currentItem);
//       // }
//       // setCardList(
//       //   cardList.map((el) => {
//       //     if (el.id === card.id) {
//       //       return card;
//       //     }
//       //     if (el.id === currentCard.id) {
//       //       return currentCard;
//       //     }
//       //     return el;
//       //   })
//       // );
//       // console.log(e.target.className === 'admin-page__item')
//       if (e.target.className === "admin-page__item") {
//          // e.target.style.backgroundColor = "orange";
//          e.target.style.paddingTop = "20px";

//          // e.target.style.transform = 'translateY(20px)';
//       }
//       // if(e.target.className === 'admin-page__card') {
//       //   e.target.style.backgroundColor = 'rgba(0,0,0,.8)'
//       // }
//    }

//    function dropItemHandler(e, card, item) {
//       e.preventDefault();
//       e.stopPropagation();
//       const currentIndex = currentCard.items.indexOf(currentItem);
//       // setCurrentCard(currentCard.items.splice(currentIndex, 1));
//       currentCard.items.splice(currentIndex, 1);
//       const dropIndex = card.items.indexOf(item);
//       if (card.id === currentCard.id) {
//          if (currentIndex === 0) {
//             card.items.splice(dropIndex + 1, 0, currentItem);
//          } else if (currentIndex > dropIndex) {
//             console.log("smaller", currentIndex, dropIndex);
//             currentIndex > 0 && card.items.splice(dropIndex, 0, currentItem);
//          } else {
//             console.log("bigger");
//             currentIndex > 0 && card.items.splice(dropIndex + 1, 0, currentItem);
//          }
//       } else {
//          card.items.splice(dropIndex, 0, currentItem);
//       }
//       // e.target.style.transform = 'translateY(0)';
//       e.target.style.backgroundColor = "white";
//       e.target.style.paddingTop = "0";

//       setCardList(
//          cardList.map((el) => {
//             if (el.id === card.id) {
//                return card;
//             }
//             if (el.id === currentCard.id) {
//                return currentCard;
//             }
//             return el;
//          })
//       );
//    }

//    function dropCardHandler(e, card) {
//       card.items.push(currentItem);
//       const currentIndex = currentCard.items.indexOf(currentItem);
//       // setCurrentCard(currentCard.items.splice(currentIndex, 1));
//       currentCard.items.splice(currentIndex, 1);
//       setCardList(
//          cardList.map((el) => {
//             if (el.id === card.id) {
//                return card;
//             }
//             if (el.id === currentCard.id) {
//                return currentCard;
//             }
//             return el;
//          })
//       );
//    }

//    function dropHandler(e, card, item) {
//       if (!item) {
//          dropCardHandler(e, card);
//       } else {
//          dropItemHandler(e, card, item);
//       }
//    }

//    function handleCreateTask(cardId) {
//       setPopup(true);
//       setEditCardId(cardId);
//    }

//    function handleAddTask(e) {
//       e.preventDefault();
//       const cardToAdd = cardList.find((el) => el.id === editCardId);
//       console.log(cardToAdd.items[cardToAdd.items.length - 1]);
//       cardToAdd.items.push({ id: cardToAdd.items.length + 1, title: values.Task, order: cardToAdd.items.length + 1 });
//       setPopup(false);
//    }

//    const [hoveredItemId, setHoveredItemId] = useState("");

//    useEffect(() => console.log(hoveredItemId), [hoveredItemId]);
//    return (
//       <div className={`admin-page ${popup && "admin-page_dark"}`}>
//          {popup && (
//             <form className="admin-page__popup">
//                <label>
//                   <span className="admin-page__label">Добавить Задачу</span>
//                   <input className="admin-page__task" name="Task" type="text" onChange={handleChange} />
//                </label>
//                <button className="admin-page__submint" type="click" onClick={handleAddTask}>
//                   Добавить
//                </button>
//             </form>
//          )}
//          {cardList.map((card) => {
//             return (
//                <div
//                   key={card.id}
//                   className="admin-page__card"
//                   onDragOver={(e) => {
//                      dragOverHandler(e, card);
//                   }}
//                   onDrop={(e) => {
//                      dropHandler(e, card, false);
//                   }}
//                >
//                   <button
//                      type="button"
//                      onClick={() => handleCreateTask(card.id)}
//                      className={`admin-page__addTask_${card.id}`}
//                   >
//                      Добавить таску
//                   </button>
//                   <span style={{ fontSize: "18px", fontWeight: 800 }}>{card.title}</span>
//                   {card.items.map((item) => {
//                      return (
//                         <div
//                            draggable={true}
//                            key={item.id}
//                            onDragStart={(e) => {
//                               dragStartHandler(e, card, item);
//                            }}
//                            onDragEnd={(e) => {
//                               dragEndHandler(e);
//                            }}
//                            onDragOver={(e) => {
//                               setHoveredItemId(item.id);
//                               dragOverHandler(e, card);
//                            }}
//                            onDragLeave={(e) => {
//                               dragLeaveHandler(e);
//                            }}
//                            onDrop={(e) => {
//                               dropHandler(e, card, item);
//                            }}
//                            className="admin-page__item"
//                         >
//                            <div draggable={false} className={`${hoveredItemId === item.id && "orange"}`}>
//                               {card.items.indexOf(item) + 1 + ". " + item.title}
//                            </div>
//                         </div>
//                      );
//                   })}
//                </div>
//             );
//          })}
//       </div>
//    );
// }

// import { useEffect } from "react";
// import { useState } from "react";
// import useFormValidaion from "../../hooks/Validation/Validation";
// import "./Admin.css";

// export function Admin() {
//    const [cardList, setCardList] = useState([
//       {
//          id: 11,
//          title: "Список задач",
//          order: 1,
//          items: [
//             { id: "a", title: "ПокушоЦЦ", order: 1 },
//             { id: "b", title: "Погладить котика", order: 2 },
//             { id: "c", title: "Поработать Немношк", order: 3 },
//          ],
//       },
//       {
//          id: 12,
//          title: "В процессе",
//          order: 2,
//          items: [
//             { id: "d", title: "Ввести новые товары", order: 1 },
//             { id: "e", title: "Погладить котика", order: 2 },
//          ],
//       },
//       {
//          id: 13,
//          title: "Сделано",
//          order: 3,
//          items: [
//             { id: "f", title: "Составить отчет", order: 1 },
//             { id: "g", title: "Погладить котика", order: 2 },
//             { id: "h", title: "Добыть еще котиков", order: 3 },
//          ],
//       },
//    ]);

//    const { resetForm, values, errors, isValid, handleChange, setValues } = useFormValidaion();

//    const [currentCard, setCurrentCard] = useState({});
//    const [currentItem, setCurrentItem] = useState({});

//    const [popup, setPopup] = useState(false);

//    const [editCardId, setEditCardId] = useState(0);

//    function dragStartHandler(e, card, item) {
//       // console.log(card, item);
//       setCurrentCard(card);
//       setCurrentItem(item);
//    }

//    function dragEndHandler(e) {
//       // e.target.style.backgroundColor = 'white'
//       // e.target.style.backgroundColor = "white";
//    }

//    function dragLeaveHandler(e) {
//       // e.target.style.backgroundColor = "white";
//       e.target.style.paddingTop = "0";
//       setHoveredItemId("");
//       // e.target.style.transform = 'translateY(0)';
//    }

//    function dragOverHandler(e, card) {
//       e.preventDefault();
//       e.stopPropagation();
//       console.log(e.target);
//       // const currentIndex = currentCard.items.indexOf(currentItem);
//       // currentCard.items.splice(currentIndex, 1);
//       // const dropIndex = card.items.indexOf(currentItem);
//       // if (card.id === currentCard.id) {
//       //   if (currentIndex === 0) {
//       //     card.items.splice(dropIndex + 1, 0, currentItem);
//       //   }
//       //   else if (currentIndex > dropIndex) {
//       //     console.log('smaller',currentIndex, dropIndex)
//       //     currentIndex > 0 && card.items.splice(dropIndex, 0, currentItem);
//       //   }
//       //   else{
//       //     console.log('bigger')
//       //     currentIndex > 0 && card.items.splice(dropIndex + 1, 0, currentItem);
//       //   }
//       // } else {
//       //   card.items.splice(dropIndex, 0, currentItem);
//       // }
//       // setCardList(
//       //   cardList.map((el) => {
//       //     if (el.id === card.id) {
//       //       return card;
//       //     }
//       //     if (el.id === currentCard.id) {
//       //       return currentCard;
//       //     }
//       //     return el;
//       //   })
//       // );
//       // console.log(e.target.className === 'admin-page__item')
//       if (e.target.className === "admin-page__item") {
//          // e.target.style.backgroundColor = "orange";
//          e.target.style.paddingTop = "20px";

//          // e.target.style.transform = 'translateY(20px)';
//       }
//       // if(e.target.className === 'admin-page__card') {
//       //   e.target.style.backgroundColor = 'rgba(0,0,0,.8)'
//       // }
//    }

//    function dropItemHandler(e, card, item) {
//       e.preventDefault();
//       e.stopPropagation();
//       const currentIndex = currentCard.items.indexOf(currentItem);
//       // setCurrentCard(currentCard.items.splice(currentIndex, 1));
//       currentCard.items.splice(currentIndex, 1);
//       const dropIndex = card.items.indexOf(item);
//       if (card.id === currentCard.id) {
//          if (currentIndex === 0) {
//             card.items.splice(dropIndex + 1, 0, currentItem);
//          } else if (currentIndex > dropIndex) {
//             console.log("smaller", currentIndex, dropIndex);
//             currentIndex > 0 && card.items.splice(dropIndex, 0, currentItem);
//          } else {
//             console.log("bigger");
//             currentIndex > 0 && card.items.splice(dropIndex + 1, 0, currentItem);
//          }
//       } else {
//          card.items.splice(dropIndex, 0, currentItem);
//       }
//       // e.target.style.transform = 'translateY(0)';
//       e.target.style.backgroundColor = "white";
//       e.target.style.paddingTop = "0";

//       setCardList(
//          cardList.map((el) => {
//             if (el.id === card.id) {
//                return card;
//             }
//             if (el.id === currentCard.id) {
//                return currentCard;
//             }
//             return el;
//          })
//       );
//    }

//    function dropCardHandler(e, card) {
//       card.items.push(currentItem);
//       const currentIndex = currentCard.items.indexOf(currentItem);
//       // setCurrentCard(currentCard.items.splice(currentIndex, 1));
//       currentCard.items.splice(currentIndex, 1);
//       setCardList(
//          cardList.map((el) => {
//             if (el.id === card.id) {
//                return card;
//             }
//             if (el.id === currentCard.id) {
//                return currentCard;
//             }
//             return el;
//          })
//       );
//    }

//    function dropHandler(e, card, item) {
//       if (!item) {
//          dropCardHandler(e, card);
//       } else {
//          dropItemHandler(e, card, item);
//       }
//    }

//    function handleCreateTask(cardId) {
//       setPopup(true);
//       setEditCardId(cardId);
//    }

//    function handleAddTask(e) {
//       e.preventDefault();
//       const cardToAdd = cardList.find((el) => el.id === editCardId);
//       console.log(cardToAdd.items[cardToAdd.items.length - 1]);
//       cardToAdd.items.push({ id: cardToAdd.items.length + 1, title: values.Task, order: cardToAdd.items.length + 1 });
//       setPopup(false);
//    }

//    const [hoveredItemId, setHoveredItemId] = useState("");

//    useEffect(() => console.log(hoveredItemId), [hoveredItemId]);
//    return (
//       <div className={`admin-page ${popup && "admin-page_dark"}`}>
//          {popup && (
//             <form className="admin-page__popup">
//                <label>
//                   <span className="admin-page__label">Добавить Задачу</span>
//                   <input className="admin-page__task" name="Task" type="text" onChange={handleChange} />
//                </label>
//                <button className="admin-page__submint" type="click" onClick={handleAddTask}>
//                   Добавить
//                </button>
//             </form>
//          )}
//          {cardList.map((card) => {
//             return (
//                <div
//                   key={card.id}
//                   className="admin-page__card"
//                   onDragOver={(e) => {
//                      dragOverHandler(e, card);
//                   }}
//                   onDrop={(e) => {
//                      dropHandler(e, card, false);
//                   }}
//                >
//                   <button
//                      type="button"
//                      onClick={() => handleCreateTask(card.id)}
//                      className={`admin-page__addTask_${card.id}`}
//                   >
//                      Добавить таску
//                   </button>
//                   <span style={{ fontSize: "18px", fontWeight: 800 }}>{card.title}</span>
//                   {card.items.map((item) => {
//                      return (
//                         <div
//                            draggable={true}
//                            key={item.id}
//                            onDragStart={(e) => {
//                               dragStartHandler(e, card, item);
//                            }}
//                            onDragEnd={(e) => {
//                               dragEndHandler(e);
//                            }}
//                            onDragOver={(e) => {
//                               setHoveredItemId(item.id);
//                               dragOverHandler(e, card);
//                            }}
//                            onDragLeave={(e) => {
//                               dragLeaveHandler(e);
//                            }}
//                            onDrop={(e) => {
//                               dropHandler(e, card, item);
//                            }}
//                            className="admin-page__item"
//                         >
//                            <div draggable={false} className={`${hoveredItemId === item.id && "orange"}`}>
//                               {card.items.indexOf(item) + 1 + ". " + item.title}
//                            </div>
//                         </div>
//                      );
//                   })}
//                </div>
//             );
//          })}
//       </div>
//    );
// }
