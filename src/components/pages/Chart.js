import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Switch from "react-switch";
import axios from "axios";
import HistoryChart, { TrendHistoryChart } from "../chart/ChartJS";
import TrendView, {
  TempTrendView,
  TempMoonTrendView,
  TempLongMoonsTrendView,
} from "../chart/TrendView.js";
import "react-datepicker/dist/react-datepicker.css";
import "./css/chart.css";

const options = [
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
  { value: "200", label: "200" },
  { value: "500", label: "500" },
  { value: "1000", label: "1000" },
  { value: "2000", label: "2000" },
  { value: "5000", label: "All" },
];
const probLevel = [1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const probLevelLabel = [
  "x < 1.5",
  "1.5 <= x < 2",
  "2 <= x < 3",
  "3 <= x < 4",
  "4 <= x < 5",
  "5 <= x < 6",
  "6 <= x < 7",
  "7 <= x < 8",
  "8 <= x < 9",
  "9 <= x < 10",
  "10 <= x",
];
const probDefaultValues = [35, 16, 16, 8, 5, 4, 4, 2, 2, 1, 10];
let intervalId;

function Chart() {
  let [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(20);
  const [lastMoon, setMoon] = useState("");
  const [lastCentury, setCentury] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [probArr, setProbability] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [isResult, setSwitch] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [moons, setMoons] = useState([]);
  const [longMoons, setLongMoons] = useState([]);
  const [greens, setGreens] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [poolProfit, setPoolProfit] = useState(0);
  const [isInfoShow, setInfoShow] = useState(true);
  const [isPercentageShow, setPercentageShow] = useState(true);
  const [isTrendShow, setTrendShow] = useState(false);
  const [isAutoRefresh, setAutoRefresh] = useState(false);
  const [isAlert, setAlert] = useState(false);

  useEffect(() => {
    // axios.get(`http://185.234.67.57:3900/getByDate?limit=${limit}&date=${startDate.toISOString()}`)
    fetch(
      `http://localhost:3900/getByDate?limit=${limit}&date=${startDate.toISOString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((histories) => {
        // const reverseData = data.reverse();
        // console.log('Success:', data);

        dataAction(histories);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [startDate, limit, refresh]);

  function dataAction(histories) {
    let results = histories.map((item) => item.result);
    let enhancedHistories = histories.map((item, ind) => {
      return {
        ...item,
        moonPercent: getMoonPercent(results, 100, ind)[10],
      };
    });

    setData(enhancedHistories);
    let lastCentury = histories.filter((item) => item.result >= 100);
    let lastMoon = histories.filter((item) => item.result >= 10);

    if (lastCentury.length > 0)
      setCentury(histories[0].gameId - lastCentury[0].gameId);
    else setCentury("Not found");

    if (lastMoon.length > 0) {
      setMoon(histories[0].gameId - lastMoon[0].gameId);
    } else setMoon("Not found");

    let probabilities = {
      all: getProbability(histories, histories.length),
      d100: getProbability(histories, 100),
      d500: getProbability(histories, 500),
    };
    setProbability(probabilities);
    setPoolProfit(getPoolProfit(histories));

    if (searchParams.get("mode") === "2") {
      setTrendData(
        histories.map((item, ind) => {
          const period = 50;
          let arr = [];
          let subData = histories
            .slice(ind + 1, ind + 1 + period)
            .map((item) => item.result);

          arr.push(subData.filter((result) => result < 1.5).length);
          for (let i = 0; i < probLevel.length; i++) {
            arr.push(subData.filter((result) => result >= probLevel[i]).length);
          }

          arr[0] = Math.ceil((arr[0] / period) * 100);
          for (let i = 1; i <= arr.length - 2; i++)
            arr[i] = Math.ceil(((arr[i] - arr[i + 1]) / period) * 100);
          arr[10] = Math.ceil((arr[10] / period) * 100);

          return { ...item, possibility: arr[0] + arr[1] };
        })
      );
    }

    if (isAlert && parseFloat(probArr["d100"][10]) <= 6) {
      alert("Moon Alert");
    }

    // checkSky(histories)
    // getMoons(histories)

    // getLongMoons(histories)

    checkSameNextColorCase(histories);
    // checkDoubleGreenCase(histories)
    // checkDoubleRedCase(histories)

    // checkMoon(histories)

    // checkMoonCases_MLMM(histories)
    // checkMoonCases_MLH(histories)
    // checkMoonCases_M10ML(histories)

    // getBets();
  }

  function getLongMoons(histories) {
    let filtered = histories.filter((item, ind) => {
      if (item.result >= 10) {
        let sub = histories
          .slice(ind + 1, ind + 41)
          .filter((h) => h.result >= 10);

        if (sub.length > 0) return false;

        return true;
      } else {
        return false;
      }
    });

    console.log("AAA", filtered);
  }

  function handleAutoRefresh() {
    setAutoRefresh(!isAutoRefresh);

    if (!isAutoRefresh) {
      intervalId = setInterval(() => {
        setRefresh(Math.random());
      }, 5000);
    } else {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function getProbability(data, period) {
    let arr = [];
    let subData = data.slice(0, period);

    arr.push(subData.filter((item) => item.result < 1.5).length);
    for (let i = 0; i < probLevel.length; i++) {
      arr.push(subData.filter((item) => item.result >= probLevel[i]).length);
    }
    // arr.push(subData.filter(item => item.result >= 10).length);

    arr[0] = ((arr[0] * 100) / subData.length).toFixed(1);
    for (let i = 1; i <= arr.length - 2; i++)
      arr[i] = (((arr[i] - arr[i + 1]) * 100) / subData.length).toFixed(1);
    arr[10] = ((arr[10] * 100) / subData.length).toFixed(1);

    return arr;
  }

  function getPoolProfit(data) {
    return data
      .map((item) => item.poolProfit)
      .reduce((prev, cur) => prev + cur, 0);
  }

  function getBets() {
    fetch(`http://localhost:3800/getBets?limit=1000&id=4999000`, {
      // fetch(`http://localhost:3800/getRecentBets?limit=${limit}&id=5019000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((bets) => {
        // const reverseData = data.reverse();
        // console.log('Success BETS:', bets);

        const ids = [
          4591927, 3204077, 1774234, 4153327, 3650160, 3901042, 4669651,
        ];
        const earningArr = [];
        const betArr = bets.map((item) => item.bets).flat();

        ids.forEach((id) =>
          earningArr.push(
            betArr
              .filter((item) => item.userId === id)
              .map((item) => item.earning)
          )
        );
        earningArr.forEach((earnings, ind) =>
          console.log(
            ind + 1,
            " Bet Count: ",
            earnings.length,
            "Profit: ",
            earnings.reduce((prev, cur) => prev + cur, 0)
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function checkMoon(data) {
    const defaultBetAmount = 1;
    let sum = 0,
      count = 0,
      perimeter = 20,
      betAmount = 1,
      failureCount = 0;
    let isStop = false;
    let maxBetAmount = 1,
      lostSum = 0;

    for (let i = data.length - 1; i >= 0; i--) {
      let arr = [];
      let subData = data.slice(i + 1, i + 1 + perimeter);
      arr.push(subData.filter((item) => item.result < 1.5).length);
      for (let i = 0; i < probLevel.length; i++) {
        arr.push(subData.filter((item) => item.result >= probLevel[i]).length);
      }

      arr[0] = Math.ceil((arr[0] / perimeter) * 100);
      for (let i = 1; i <= arr.length - 2; i++)
        arr[i] = Math.ceil(((arr[i] - arr[i + 1]) / perimeter) * 100);
      arr[10] = Math.ceil((arr[10] / perimeter) * 100);

      if (!isStop) {
        if (data[i].result >= 10) {
          sum += 9 * betAmount;
          lostSum += 9 * betAmount;
          betAmount = defaultBetAmount;
          if (lostSum > 0) lostSum = 0;
        } else {
          sum -= betAmount;
          lostSum -= betAmount;
          count++;
          failureCount++;

          if (count >= 5) {
            betAmount *= 2;
            count = 0;
          }
        }
      }

      if (data[i].result >= 10) {
        count = 0;
        failureCount = 0;
        isStop = false;
      }

      // if (lostSum < -100) {
      //   betAmount = 16;
      // }

      // if (failureCount >= 40) {
      //   isStop = true;
      //   // betAmount = 16;
      //   betAmount = 1;
      // }

      if (maxBetAmount < betAmount) maxBetAmount = betAmount;

      // if (betAmount > 8)
      // console.log('WWWWWW', data[i].gameId, arr[10] + '%', betAmount, count, failureCount, sum, lostSum)
    }
    // console.log(data)
    console.log("Total Sum=", sum, maxBetAmount);
  }

  function getPercent(data, perimeter, pos) {
    let arr = [];
    let subData = data.slice(pos + 1, pos + 1 + perimeter);

    arr.push(subData.filter((result) => result < 1.5).length);
    for (let i = 0; i < probLevel.length; i++) {
      arr.push(subData.filter((result) => result >= probLevel[i]).length);
    }

    arr[0] = Math.ceil((arr[0] / perimeter) * 100);
    for (let i = 1; i <= arr.length - 2; i++)
      arr[i] = Math.ceil(((arr[i] - arr[i + 1]) / perimeter) * 100);
    arr[10] = Math.ceil((arr[10] / perimeter) * 100);

    return arr;
  }

  function getMoonPercent(data, perimeter, pos) {
    let arr = [];
    let subData = data.slice(pos + 1, pos + 1 + perimeter);

    arr.push(subData.filter((result) => result < 1.5).length);
    for (let i = 0; i < probLevel.length; i++) {
      arr.push(subData.filter((result) => result >= probLevel[i]).length);
    }

    arr[0] = Math.ceil((arr[0] / perimeter) * 100);
    for (let i = 1; i <= arr.length - 2; i++)
      arr[i] = Math.ceil(((arr[i] - arr[i + 1]) / perimeter) * 100);
    arr[10] = Math.ceil((arr[10] / perimeter) * 100);

    return arr;
  }

  function checkSameNextColorCase(data) {
    const partData = data
      .map(({ gameId, poolProfit, result }) => ({ gameId, poolProfit, result }))
      .reverse();
    const results = data.map((item) => item.result).reverse();
    let sum = 0,
      multiply = 0,
      maxMul = 1,
      maxInd = 0;
    let dangerCnt = 0,
      skip = 0,
      cnt1 = 0,
      cnt2 = 0;

    console.log("total = ", data.length);
    for (let i = 1; i < results.length; i++) {
      if (skip > 0) {
        skip--;
        continue;
      }

      // console.log(results[i-1], results[i], multiply)
      if (results[i - 1] < 2 && results[i] < 2) {
        if (multiply === 5) cnt1++;
        if (multiply >= 7) {
          const temp = partData.slice(i - maxMul, i + 1);
          console.error(Math.pow(2, multiply), temp);
          console.log(getPercent(results, 50, i - maxMul - 1));
        }
        sum += Math.pow(2, multiply) * 0.96;
        multiply = 0;
      } else if (results[i - 1] >= 2 && results[i] >= 2) {
        if (multiply === 5) cnt1++;
        if (multiply >= 7) {
          const temp = partData.slice(i - maxMul, i + 1);
          console.error(Math.pow(2, multiply), temp);
          console.log(getPercent(results, 50, i - maxMul - 1));
        }
        sum += Math.pow(2, multiply);
        multiply = 0;
      } else {
        if (multiply === 5) cnt2++;
        sum -= Math.pow(2, multiply);
        multiply++;
        if (maxMul < multiply) {
          maxMul = multiply;
          maxInd = i;
        }
      }

      if (multiply === 5) {
        // skip = 6;
        dangerCnt++;
      }
    }

    console.log(
      "Sum: ",
      sum,
      " MaxMul: ",
      Math.pow(2, maxMul),
      " Index: ",
      maxInd
    );
    console.log(dangerCnt);
    console.log(results.slice(maxInd - 25, maxInd + 2));
    console.log(cnt1, cnt2);
  }

  function checkDoubleGreenCase(data) {
    const partData = data
      .map(({ gameId, poolProfit, result }) => ({ gameId, poolProfit, result }))
      .reverse();
    const results = data.map((item) => item.result).reverse();
    let sum = 0,
      multiply = 0,
      maxMul = 1,
      maxInd = 0;
    let dangerCnt = 0,
      skip = 0,
      cnt1 = 0,
      cnt2 = 0;

    console.log("------------GREEN-------------");
    for (let i = 1; i < results.length; i++) {
      if (skip > 0) {
        skip--;
        continue;
      }

      // console.log(results[i-1], results[i], multiply)
      if (results[i - 1] >= 2 && results[i] >= 2) {
        if (multiply === 5) cnt1++;
        if (multiply >= 7) {
          const temp = partData.slice(i - maxMul, i + 1);
          console.error(Math.pow(2, multiply), temp);
          console.log(getPercent(results, 50, i - maxMul - 1));
        }
        sum += Math.pow(2, multiply);
        multiply = 0;
      } else if (results[i - 1] >= 2 && results[i] < 2) {
        if (multiply === 5) cnt2++;
        sum -= Math.pow(2, multiply);
        multiply++;
        if (maxMul < multiply) {
          maxMul = multiply;
          maxInd = i;
        }
      }

      if (multiply === 5) {
        // skip = 6;
        dangerCnt++;
      }
    }

    console.log(
      "Sum: ",
      sum,
      " MaxMul: ",
      Math.pow(2, maxMul),
      " Index: ",
      maxInd
    );
    console.log(dangerCnt);
    console.log(results.slice(maxInd - 25, maxInd + 2));
    console.log(cnt1, cnt2);
  }

  function checkDoubleRedCase(data) {
    const partData = data
      .map(({ gameId, poolProfit, result }) => ({ gameId, poolProfit, result }))
      .reverse();
    const results = data.map((item) => item.result).reverse();
    let sum = 0,
      multiply = 0,
      maxMul = 1,
      maxInd = 0;
    let dangerCnt = 0,
      skip = 0,
      cnt1 = 0,
      cnt2 = 0;

    console.log("------------ RED -------------");
    for (let i = 1; i < results.length; i++) {
      if (skip > 0) {
        skip--;
        continue;
      }

      // console.log(results[i-1], results[i], multiply)
      if (results[i - 1] < 2 && results[i] < 2) {
        if (multiply === 5) cnt1++;
        if (multiply >= 7) {
          const temp = partData.slice(i - maxMul, i + 1);
          console.error(Math.pow(2, multiply), temp);
          console.log(getPercent(results, 50, i - maxMul - 1));
        }
        sum += Math.pow(2, multiply) * 0.96;
        multiply = 0;
      } else if (results[i - 1] < 2 && results[i] >= 2) {
        if (multiply === 5) cnt2++;
        sum -= Math.pow(2, multiply);
        multiply++;
        if (maxMul < multiply) {
          maxMul = multiply;
          maxInd = i;
        }
      }

      if (multiply === 5) {
        // skip = 6;
        dangerCnt++;
      }
    }

    console.log(
      "Sum: ",
      sum,
      " MaxMul: ",
      Math.pow(2, maxMul),
      " Index: ",
      maxInd
    );
    console.log(dangerCnt);
    console.log(results.slice(maxInd - 25, maxInd + 2));
    console.log(cnt1, cnt2);
  }

  function checkMoonCases_MLMM(data) {
    const perimeter = 100;
    const results = data.map((item) => item.result);
    let mlmmArr = [],
      mlmmSum = 0;

    for (let i = results.length - 10; i >= 0; i--) {
      if (results[i] >= 10 && results[i - 1] >= 10) {
        let count = 0,
          betAmount = 1,
          cnt = 0,
          tempSum = 0;

        while (results[i - 2 - count] < 10) {
          count++;

          if (count <= 25) {
            tempSum -= betAmount;
            cnt++;
          }

          if (cnt >= 5) {
            betAmount *= 2;
            cnt = 0;
          }
        }

        if (count < 1) continue;

        if (results[i - 2 - count] >= 10) {
          let percentArr = getPercent(results, perimeter, i);

          // mlmmArr.push(data[i].gameId + ' - ' + results[i] + ' - ' + count + ' - ' + results[i+count+1] + ' - ' + results[i+count+2])
          mlmmArr.push(count);

          if (count <= 25) {
            mlmmSum += betAmount * 9 + tempSum;
            console.log(
              count,
              percentArr[10],
              results.slice(i - 2 - count, i + 1)
            );
          } else {
            mlmmSum += tempSum;
            console.warn(
              count,
              percentArr[10],
              results.slice(i - 2 - count, i + 1)
            );
          }
        }
      }
    }

    console.log("M -L- M M: ", mlmmArr, "Sum: ", mlmmSum);
  }

  function checkMoonCases_MLH(data) {
    const perimeter = 20;
    const results = data.map((item) => item.result);
    let mlhArr = [],
      mlhSum = 0;

    for (let i = results.length - 10; i >= 0; i--) {
      // let percentArr = getPercent(results, perimeter, i);

      if (results[i] >= 100) {
        let count = 0,
          betAmount = 1,
          cnt = 0,
          tempSum = 0;

        while (results[i - 1 - count] < 10) {
          count++;

          if (count <= 25) {
            tempSum -= betAmount;
            cnt++;
          }

          if (cnt >= 5) {
            betAmount *= 2;
            cnt = 0;
          }
        }

        if (count < 1) continue;

        if (results[i - 1 - count] >= 10) {
          // console.log(count, results.slice(i-1-count, i+1), tempSum)
          // mlhArr.push(data[i].gameId + ' - ' + results[i] + ' - ' + count + ' - ' + results.slice(i+count+1, i+count+5).join(' - '))
          mlhArr.push(count);

          if (count <= 25) mlhSum += betAmount * 9 + tempSum;
          else mlhSum += tempSum;
        }
      }

      // -L- M - M
    }

    console.log("M -L- H: ", mlhArr, "Sum: ", mlhSum);
  }

  function checkMoonCases_M10ML(data) {
    const perimeter = 100,
      limit = 1,
      length = 20;
    const results = data.map((item) => item.result);
    let mmlArr = [],
      mmlSum = 0;

    for (let i = results.length - 10; i >= 0; i--) {
      let percentArr = getPercent(results, perimeter, i);

      if (results[i] >= 10) {
        let subResults = results.slice(i + 1, i + 1 + length);

        if (
          subResults.length >= length &&
          subResults.filter((result) => result >= 10).length === 0
        ) {
          let count = 0,
            betAmount = 10,
            tempSum = 0;

          while (results[i - 1 - count] < 10) {
            count++;

            if (count <= limit) {
              tempSum -= betAmount;
            }
          }

          if (results[i - 1 - count] >= 10) {
            // mmlArr.push(data[i].gameId + ' - ' + results[i] + ' - ' + count + ' - ' + results.slice(i+count+1, i+count+5).join(' - '))

            if (count <= limit) {
              mmlSum += betAmount * 9 + tempSum;
              console.log(
                count,
                percentArr[10],
                results.slice(i - 1 - count, i + 1),
                betAmount * 9 + tempSum
              );
            } else {
              mmlSum -= betAmount * 2;
              console.warn(
                count,
                percentArr[10],
                results.slice(i - 1 - count, i + 1),
                betAmount * 2
              );
            }
          }
        }
      }
    }

    console.log("M -L- M M: ", mmlArr, "Sum: ", mmlSum);
  }

  function checkSky(data) {
    let sum = 0,
      c1 = 0,
      c2 = 0;
    let count = 0;
    let arr = [];

    for (let i = 0; i < data.length - 3; i++) {
      // if (count > 200) {
      //   if (data[i].result >= 100)
      //     count = 0;
      //   else {
      //     count ++;
      //   }
      // }
      // else {
      if (data[i].result >= 100) {
        sum += 99;
        c1++;
        arr.push(count);
        // arr.push(data[i].result)
        count = 0;
      } else {
        sum--;
        c2++;
        count++;
      }
      // }
    }
    console.log("sum=", sum);
    console.log("count=", c1, c2);
    // console.log(arr.sort((a,b) => a-b))
    console.log(arr);
  }

  function getMoons(data) {
    const perimeter = 100;
    const resultArr = data.map((item) => item.result);

    let count = 0;
    let arr1 = [],
      arr2 = [];

    for (let i = data.length - perimeter; i >= 0; i--) {
      if (data[i].result >= 10) {
        if (count >= 24) {
          let percent1Arr = getPercent(resultArr, perimeter, i);
          let nextArr = data.slice(i - 20, i).map((item) => item.result);
          let moon1 =
            data[i].result +
            "(" +
            data[i].gameId +
            ", " +
            percent1Arr[10] +
            "%)";
          let percent2Arr = getPercent(resultArr, perimeter, i + count + 1);
          let prevArr = data
            .slice(i + 2 + count, i + count + 22)
            .map((item) => item.result);
          let moon2 =
            data[i + count + 1].result +
            "(" +
            data[i + count + 1].gameId +
            ", " +
            percent2Arr[10] +
            "%)";
          arr2.push([nextArr, moon1, count, moon2, prevArr]);

          arr1.push([
            count,
            data[i].gameId,
            percent1Arr[10] + "%",
            ...data.slice(i + count, i + count + 22).map((item) => item.result),
          ]);
        }

        count = 0;
      } else {
        count++;
      }
    }
    // console.log('Moons', arr1.sort((a,b) => a[1] - b[1]))
    console.log("Moons", arr1);
    // setMoons(arr1)
    setLongMoons(arr2);
  }

  function handleZoom(min, max, zoomLevel) {
    // setZoomLevel(zoomLevel)
    const initialValue = 0;
    const poolSum = data
      .filter(
        ({ gameId }) => gameId <= data[min].gameId && gameId >= data[max].gameId
      )
      .map((item) => parseInt(item.poolProfit))
      .reduce((prev, cur) => prev + cur, initialValue);
    console.log(poolSum);

    // let payouts = data
    //     .filter(item => item.gameId >= startPos && item.gameId <= endPos)
    //     .map(item => item.result).reduce((prev, cur) => prev + cur, 0);
    // console.log('total payouts=', payouts);
  }

  function handlePan(min, max, chart) {
    if (max === data.length - 1) {
      fetch(
        `http://185.234.67.57:3900/getPeriod?start=${
          data[data.length - 1].gameId - 1
        }&end=${data[data.length - 1].gameId - 101}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((histories) => {
          // const reverseData = data.reverse();
          // console.log('Success:', data);
          dataAction(data.concat(histories));
          // chart.zoom(zoomLevel)
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  return (
    <div className="App">
      <div className="header">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />

        <Select
          className="limit-select"
          defaultValue="20"
          options={options}
          onChange={(evt) => setLimit(evt.value)}
        />

        <button className="refresh-btn" onClick={() => setRefresh(refresh + 1)}>
          Refresh
        </button>

        <label className="switch-container">
          <span>Real result</span>
          <Switch
            className="react-switch"
            checked={isResult}
            onChange={() => setSwitch(!isResult)}
          />
        </label>

        <label className="switch-container">
          <span>Show info</span>
          <Switch
            className="react-switch"
            checked={isInfoShow}
            onChange={() => setInfoShow(!isInfoShow)}
          />
        </label>

        {isInfoShow && (
          <div className="history-info">
            <span
              className="pool-profit"
              style={{ color: poolProfit > 0 ? "green" : "red" }}
            >
              Pool Profit: {poolProfit}
            </span>
            <span className="sky-count">
              Sky Count: {data.filter((item) => item.result >= 100).length}
            </span>
            <span className="moon-count">
              Moon Count: {data.filter((item) => item.result >= 10).length}
            </span>
            <span className="last-century">Last Sky: {lastCentury}</span>
            <span className="last-moon">Last Moon: {lastMoon}</span>
            {/* <div className="close-btn">
                <img src={CloseIcon} alt="Close Icon" width={12} height={12} />
              </div> */}
          </div>
        )}

        <label className="switch-container">
          <span>Show percentage</span>
          <Switch
            className="react-switch"
            checked={isPercentageShow}
            onChange={() => setPercentageShow(!isPercentageShow)}
          />
        </label>

        <label className="switch-container">
          <span>Autoload</span>
          <Switch
            className="react-switch"
            checked={isAutoRefresh}
            onChange={handleAutoRefresh}
          />
        </label>

        <label className="switch-container">
          <span>Alert Moon</span>
          <Switch
            className="react-switch"
            checked={isAlert}
            onChange={() => setAlert(!isAlert)}
          />
        </label>

        {/* <label className="switch-container">
          <span>Show Trend</span>
          <Switch 
            className="react-switch" 
            checked={isTrendShow} 
            onChange={() => setTrendShow(!isTrendShow)} 
            />
        </label> */}
      </div>

      {/* <Recharts data={data} /> */}
      <HistoryChart
        data={data}
        isPro
        isResult={isResult}
        onPan={handlePan}
        onZoom={handleZoom}
      />

      {searchParams.get("mode") === "2" && (
        <TrendHistoryChart
          data={trendData}
          isResult={isResult}
          onPan={handlePan}
          onZoom={handleZoom}
        />
      )}

      {isPercentageShow && (
        <div className="probability_container">
          {searchParams.get("mode") !== "1" ? (
            <div>
              {probArr["d100"]?.map((item, ind) => (
                <div key={`d100_${ind}`} className="prob-wrapper">
                  <div className="prob-label">{probLevelLabel[ind]}</div>
                  <div className="prob-value">{item}</div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div>
                <span>Last 500</span>
                {console.log(probArr["d500"])}
                {probArr["d500"]?.map((item, ind) => (
                  <div key={`d500_${ind}`} className="prob-wrapper">
                    <div className="prob-label">
                      {probLevelLabel[ind]} ({probDefaultValues[ind]})
                    </div>
                    {/* <div className="prob-label">{probLevelLabel[ind]}</div> */}
                    <div className="prob-value">{Math.ceil(item)}</div>
                  </div>
                ))}
              </div>
              <div>
                <span>Last 100</span>
                {console.log(probArr["d100"])}
                {probArr["d100"]?.map((item, ind) => (
                  <div key={`d100_${ind}`} className="prob-wrapper">
                    <div className="prob-label">
                      {probLevelLabel[ind]} ({probDefaultValues[ind]})
                    </div>
                    {/* <div className="prob-label">{probLevelLabel[ind]}</div> */}
                    <div className="prob-value">{Math.ceil(item)}</div>
                  </div>
                ))}
              </div>
              <div>
                <span>Selected</span>
                {console.log(probArr["all"])}
                {probArr["all"]?.map((item, ind) => (
                  <div key={`all_${ind}`} className="prob-wrapper">
                    <div className="prob-label">
                      {probLevelLabel[ind]} ({probDefaultValues[ind]})
                    </div>
                    {/* <div className="prob-label">{probLevelLabel[ind]}</div> */}
                    <div className="prob-value">{item}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {isTrendShow && (
        <>
          <TempLongMoonsTrendView data={longMoons} />

          <p>Moons</p>
          <TempTrendView data={moons} />

          <p>Greens</p>
          <TempTrendView data={greens} />
        </>
      )}
    </div>
  );
}

export default Chart;
