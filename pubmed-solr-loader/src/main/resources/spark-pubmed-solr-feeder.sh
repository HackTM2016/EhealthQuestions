#!/usr/bin/env bash

# solrctl instancedir --generate <path>
# solrctl instancedir --create <confif_name> <path>
# solrctl collection --create <name> -s <shards_number> -c <config_name>

sudo -u hdfs \
spark-submit \
	-v \
        --class hacktm.pubmed.SolrPubmedArticleFeeder \
        --master yarn-client \
	--conf "spark.dynamicAllocation.enabled=true" \
	--conf "spark.executor.memory=1800MB" \
	--conf "spark.executor.cores=2" \
	--conf "spark.executor.instances=7" \
        /hacktm/spark-pubmed-1.0.0-SNAPSHOT-jar-with-dependencies.jar \
        10.0.1.4:2181,10.0.1.8:2181,10.0.1.247:2181/solr \
        pubmed \
	/user/hacktm/pubmed/rawdata
