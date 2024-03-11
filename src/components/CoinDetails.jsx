import {
  Grid,
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { server } from "../index";
import Chart from "./Chart";
import ErrorComponent from "./ErrorComponent";
import Loader from "./Loader";
import "./CoinDetails.css";

const CoinDetails = () => {
  const params = useParams();
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);
  const [trending, setTrending] = useState({});

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "1y", "max"];

  const switchChartStats = (key) => {
    switch (key) {
      case "24h":
        setDays("24h");
        setLoading(true);
        break;
      case "7d":
        setDays("7d");
        setLoading(true);
        break;
      case "14d":
        setDays("14d");
        setLoading(true);
        break;
      case "30d":
        setDays("30d");
        setLoading(true);
        break;
      case "60d":
        setDays("60d");
        setLoading(true);
        break;
      case "200d":
        setDays("200d");
        setLoading(true);
        break;
      case "1y":
        setDays("365d");
        setLoading(true);
        break;
      case "max":
        setDays("max");
        setLoading(true);
        break;

      default:
        setDays("24h");
        setLoading(true);
        break;
    }
  };

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);
        let data2; // Initialize data2 to prevent undefined errors

        const { data: response } = await axios.get(
          "https://api.coingecko.com/api/v3/search/trending"
        );
        //   console.log(response);

        data2 = response.coins;
        const { data: chartData } = await axios.get(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
        );
        // console.log(data2);
        setCoin(data);
        setTrending(data2);
        setChartArray(chartData.prices);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [params.id, currency, days]);

  //   console.log(trending);
  if (error) return <ErrorComponent message={"Error While Fetching Coin"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Grid minH="100vh" templateColumns="80% 20%">
            <Box>
              <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
                <HStack spacing={"4"}>
                  <Radio value={"inr"}>INR</Radio>
                  <Radio value={"usd"}>USD</Radio>
                  <Radio value={"eur"}>EUR</Radio>
                </HStack>
              </RadioGroup>
              <VStack spacing={"8"} p="16" alignItems={"flex-start"}>
                <Stat>
                  <HStack spacing={"4"}>
                    <Image
                      src={coin.image.large}
                      w={"16"}
                      h={"16"}
                      objectFit={"contain"}
                    />
                    <StatLabel fontSize={"2xl"}>{coin.name}</StatLabel>
                    <StatLabel fontSize={"2xl"}>{coin.symbol}</StatLabel>
                    <Badge fontSize={"2xl"} bgColor={"grey"} color={"white"}>
                      {`Rank #${coin.market_cap_rank}`}
                    </Badge>
                  </HStack>

                  <StatNumber>
                    {currencySymbol}
                    {coin.market_data.current_price[currency]}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow
                      type={
                        coin.market_data.price_change_percentage_24h > 0
                          ? "increase"
                          : "decrease"
                      }
                    />
                    {coin.market_data.price_change_percentage_24h}%
                  </StatHelpText>
                </Stat>
              </VStack>
              <Box width={"full"} borderWidth={1}>
                <Chart arr={chartArray} currency={currencySymbol} days={days} />
              </Box>

              <HStack p="4" overflowX={"auto"}>
                {btns.map((i) => (
                  <Button
                    disabled={days === i}
                    key={i}
                    onClick={() => switchChartStats(i)}
                  >
                    {i}
                  </Button>
                ))}
              </HStack>

              <VStack w={"full"} mt="8" gap={8}>
                <CustomBar
                  high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
                  low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}
                  title={`24H Range`}
                />
                <CustomBar
                  high={`${currencySymbol}${coin.market_data.ath[currency]}`}
                  low={`${currencySymbol}${coin.market_data.atl[currency]}`}
                  title={`52W Range`}
                />
              </VStack>

              <Box w={"full"} p="4" mt="8">
                <Heading>Fundamental Overview</Heading>
                <HStack
                  className={"fundamental-info"}
                  justifyContent={"space-between"}
                  w={"full"}
                  mt="4"
                  alignItems={"flex-start"}
                  gap={4}
                  //   flexDirection="column"
                >
                  <VStack>
                    <Item
                      title={"Trading Volume"}
                      value={`${currencySymbol}${coin.market_data.current_price[currency]}`}
                    />
                    <Item
                      title={"Price (24h Low)/Price (24h High)"}
                      value={`${currencySymbol}${coin.market_data.low_24h[currency]}/${currencySymbol}${coin.market_data.high_24h[currency]}`}
                    />
                    <Item
                      title={"Price (7d Low)/Price (7d High)"}
                      value={`${currencySymbol}${coin.market_data.atl[currency]}/${currencySymbol}${coin.market_data.ath[currency]}`}
                    />
                    <Item
                      title={"Trading Volume"}
                      value={`${currencySymbol}${coin.market_data.total_volume[currency]}`}
                    />
                    <Item
                      title={"Market Cap Rank"}
                      value={`#${coin.market_cap_rank}`}
                    />
                  </VStack>
                  <VStack>
                    <Item
                      title={"Market Cap"}
                      value={`${currencySymbol}${coin.market_data.market_cap[currency]}`}
                    />
                    <Item
                      title={"Market Cap Dominance"}
                      value={`${coin.market_data.market_cap_change_percentage_24h}%`}
                    />
                    <Item
                      title={"Volume / Market Cap"}
                      value={`${
                        coin.market_data.total_volume[currency] /
                        coin.market_data.market_cap[currency]
                      }`}
                    />
                    <Item
                      title={"All-Time High"}
                      value={`${currencySymbol}${coin.market_data.ath[currency]}  ${coin.market_data.ath_change_percentage[currency]}%`}
                    />
                    <Item
                      title={"All-Time Low"}
                      value={`${currencySymbol}${coin.market_data.atl[currency]}  ${coin.market_data.atl_change_percentage[currency]}%`}
                    />
                  </VStack>
                </HStack>
              </Box>

              <VStack ml={-16} spacing={"8"} p="16" alignItems={"flex-start"}>
                <Stat>
                  <StatLabel fontSize={"2xl"} color={"white"}>
                    {"You May Also Like"}
                  </StatLabel>

                  <Box
                    className={"trending-items"}
                    w={1200}
                    overflowX="auto"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    p={4}
                  >
                    <HStack
                      className="my-hstack-container"
                      spacing={"4"}
                      align="stretch"
                      justifyContent={"space-evenly"}
                      whiteSpace="nowrap"
                    >
                      {trending.map((i) => (
                        <CoinCard id={i.item.id} coin={i.item} />
                      ))}
                    </HStack>
                  </Box>
                  <StatLabel mt={20} fontSize={"2xl"} color={"white"}>
                    {"Trending Coins"}
                  </StatLabel>

                  <Box className={"trending-items"} w={1200} overflowX="auto">
                    <HStack
                      className="my-hstack-container"
                      spacing={"4"}
                      align="stretch"
                      justifyContent={"space-evenly"}
                      whiteSpace="nowrap"
                    >
                      {trending.map((i) => (
                        <CoinCard id={i.item.id} coin={i.item} />
                      ))}
                    </HStack>
                  </Box>
                </Stat>
              </VStack>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              p={4}
            >
              <Stat>
                <StatLabel fontSize={"2xl"} color={"white"}>
                  Trending Coins
                </StatLabel>
                <VStack spacing={4}>
                  {trending.slice(0, 3).map((i) => (
                    <CoinList key={i.item.id} coin={i.item} />
                  ))}
                </VStack>
              </Stat>
            </Box>
          </Grid>
        </>
      )}
    </Container>
  );
};

const CoinList = ({ id, coin }) => (
  <Link to={`/coin/${id}`}>
    <HStack
      w={"52"}
      shadow={"lg"}
      borderRadius={"lg"}
      transition={"all 0.3s"}
      m={"4"}
      css={{
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Image
        src={coin.small}
        w={"10"}
        h={"10"}
        objectFit={"contain"}
        alt={"Exchange"}
      />
      <HStack
        justifyContent={"space-between"}
        w={"full"}
        mt="4"
        alignItems={"flex-start"}
      >
        <Text size={"md"} noOfLines={1}>
          {`${coin.name}(${coin.symbol})`}
        </Text>
        <Text
          bgColor={
            coin.data.price_change_percentage_24h["usd"] >= 0
              ? "#90EE90"
              : "#FFC0CB"
          }
          color={
            coin.data.price_change_percentage_24h["usd"] >= 0 ? "green" : "red"
          }
        >
          {`${coin.data.price_change_percentage_24h["usd"].toFixed(2)}%`}
        </Text>
      </HStack>
    </HStack>
  </Link>
);

const CoinCard = ({ id, coin }) => (
  <Link to={`/coin/${id}`}>
    <VStack
      gap={4}
      w={"52"}
      shadow={"lg"}
      p={"8"}
      borderRadius={"lg"}
      transition={"all 0.3s"}
      m={"4"}
      css={{
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <HStack>
        <Image
          src={coin.small}
          w={"10"}
          h={"10"}
          objectFit={"contain"}
          alt={"Exchange"}
        />
        <Text size={"md"} noOfLines={1}>
          {coin.symbol}
        </Text>
        <Text
          bgColor={
            coin.data.price_change_percentage_24h["usd"] >= 0
              ? "#90EE90"
              : "#FFC0CB"
          }
          color={
            coin.data.price_change_percentage_24h["usd"] >= 0 ? "green" : "red"
          }
        >
          {`${coin.data.price_change_percentage_24h["usd"].toFixed(2)}%`}
        </Text>
      </HStack>
      {/* <Text noOfLines={1}>{coin.name}</Text> */}
      <Text ml={-20} noOfLines={1}>
        {coin.data.price ? `${coin.data.price}` : "NA"}
      </Text>
      <Image
        src={coin.data.sparkline}
        w={"30"}
        h={"40"}
        objectFit={"contain"}
        alt={"Exchange"}
      />
    </VStack>
  </Link>
);

const Item = ({ title, value }) => (
  <HStack justifyContent={"space-between"} w={"full"} my={"4"} mx={8}>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>
      {title}
    </Text>
    <Text>{value}</Text>
  </HStack>
);

const CustomBar = ({ high, low, title }) => (
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>{title}</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
);

export default CoinDetails;
