<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ArticlesByTagName extends AbstractController
{
    /** @var ArticleRepository  */
    protected $repository;

    public function __construct(SerializerInterface $serializer, ArticleRepository $repository)
    {
        parent::__construct($serializer);
        $this->repository = $repository;
    }

    /**
     * @Route(
     *     name="articles_by_tag_name",
     *     path="/api/articles_by_tag/{name}",
     *     methods={"GET"},
     *     defaults={
     *         "_api_item_operation_name": "api_list_elements_delete"
     *     }
     * )
     */
    public function __invoke(string $name): JsonResponse
    {
        return new JsonResponse(
            $this->serializer->serialize($this->repository->getArticlesByTagName($name), 'json'),
            Response::HTTP_OK,
            [],
            true
        );
    }
}